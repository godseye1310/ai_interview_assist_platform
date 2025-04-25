/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, db } from "@/firebase/admin"; // form Firebase Admin configuration
import { cookies } from "next/headers"; // for reading cookies

// Session duration
const ONE_DAY_IN_SECONDS = 24 * 60 * 60;
const ONE_WEEK_IN_SECONDS = 7 * ONE_DAY_IN_SECONDS;

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
		console.log("Error:", error);

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
		// checking if the user exists in the firebase auth
		const userRecord = await auth.getUserByEmail(email);
		// console.log(userRecord);
		if (!userRecord) {
			return {
				success: false,
				message: "User does not exist. Create a new account",
			};
		}

		await setSessionCookie(idToken);
		//
		return {
			success: true,
			message: "Signed in successfully",
		};
		//
	} catch (error: any) {
		console.log("Error signing in:", error);
		return {
			success: false,
			message: "Failed to log in",
		};
	}
}

// Sign in with a third-party provider
export async function signInUserWithProvider(params: SignInWithProviderParams) {
	const { uid, name, email, idToken } = params;

	try {
		const userRecord = await db.collection("users").doc(uid).get();

		//
		// console.log(userRecord);
		let userExistsInDB = true;

		if (!userRecord.exists) {
			userExistsInDB = false;
			// add user to db
			await db.collection("users").doc(uid).set({
				name,
				email,
			});
		}

		await setSessionCookie(idToken);

		return {
			success: true,
			message: "Signed In Successfully",
			userExistsInDB,
		};
		//
	} catch (error) {
		console.log("Error signing in:", error);
		return {
			success: false,
			message: "Error signing in",
		};
	}
}

// Set the session cookie
export async function setSessionCookie(idToken: string) {
	const cookieStore = await cookies();

	// Create a session cookie from the ID token:
	//  - signed by Firebase Admin SDK
	//  - expiresIn is in **milliseconds** (so ONE_WEEK * 1000)
	const sessionToken = await auth.createSessionCookie(idToken, {
		expiresIn: ONE_WEEK_IN_SECONDS * 1000, // 7 days (in milliseconds)
	});

	// Send that cookie back to the client:
	cookieStore.set("session", sessionToken, {
		maxAge: ONE_WEEK_IN_SECONDS, // in seconds (7 days)
		httpOnly: true, // <-- not accessible from JS
		secure: process.env.NODE_ENV === "production",
		path: "/",
		sameSite: "lax",
	});
}

// Get the user
export async function getCurrentUser(): Promise<User | null> {
	const cookieStore = await cookies();
	// Get the session token from the from the cookie store:
	const sessionToken = cookieStore.get("session")?.value;
	if (!sessionToken) {
		return null;
	}
	// Verify the session token:
	try {
		const decodedClaims = await auth.verifySessionCookie(
			sessionToken,
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

// Authentication session revalidation
export async function refreshSession(idToken: string) {
	// re‑mint & set a fresh 7‑day cookie
	await setSessionCookie(idToken);
}

// Delete the session cookie
export async function deleteSessionCookie() {
	const cookieStore = await cookies();
	// Deletes the “session-token” from the browser cookie store : (so subsequent requests are unauthenticated)
	cookieStore.delete({ name: "session", path: "/" });
}
