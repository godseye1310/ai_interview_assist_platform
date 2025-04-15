/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration
const ONE_WEEK = 7 * 24 * 60 * 60;

// Sign up a new user
export async function signUp(params: SignUpParams) {
	const { uid, name, email } = params;

	try {
		// Create a new user document in Firestore
		const userRecord = await db.collection("users").doc(uid).get();
		if (userRecord.exists) {
			throw new Error("User already exists");
		}
		await db.collection("users").doc(uid).set({
			name,
			email,
		});

		return {
			success: true,
			message: "Account created successfully. Please sign in",
		};
		//
	} catch (error: any) {
		console.log("Error creating a user:", error);

		if (error.code === "auth/email-already-in-use") {
			return {
				success: false,
				message: "Email already in use",
			};
		}
		return {
			success: false,
			message: "Error creating user",
		};
	}
}

// Sign in a user
export async function signIn(params: SignInParams) {
	//
	const { idToken, email } = params;

	try {
		const userRecord = await auth.getUserByEmail(email);
		if (!userRecord) {
			return {
				success: false,
				message: "User does not exist. Create a new account",
			};
		}

		await setSessionCookie(idToken);
		//
	} catch (error: any) {
		console.log("Error signing in:", error);
		return {
			success: false,
			message: "Failed to log in",
		};
	}
}

// Set the session cookie
export async function setSessionCookie(idToken: string) {
	const cookieStore = await cookies();

	const sessionCookie = await auth.createSessionCookie(idToken, {
		expiresIn: ONE_WEEK * 1000, // 7 days
	});

	cookieStore.set("session", sessionCookie, {
		maxAge: ONE_WEEK, // 7 days
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		sameSite: "lax",
	});
}

// Get the user
export async function getCurrentUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session")?.value;
	if (!sessionCookie) {
		return null;
	}
	try {
		const decodedClaims = await auth.verifySessionCookie(
			sessionCookie,
			true
		);
		const userRecord = await db
			.collection("users")
			.doc(decodedClaims.uid)
			.get();
		if (!userRecord.exists) {
			return null;
		}
		return {
			...userRecord.data(),
			id: userRecord.id,
		} as User;
		//
	} catch (error) {
		console.log("Error verifying session cookie:", error);
		return null;
	}
}

export async function getAuthentication() {
	const user = await getCurrentUser();

	return !!user;
}
