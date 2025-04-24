"use client";
import { useRouter } from "next/navigation";
// import React from "react";
import { Button } from "./ui/button";
import { deleteSessionCookie } from "@/lib/actions/auth.action";
import { auth } from "@/firebase/client";
import { signOut } from "firebase/auth";

const LogoutBtn = () => {
	const router = useRouter();
	const handleLogout = async () => {
		// Your logout logic here
		// 1️ Firebase client sign-out (clears local SDK state)
		await signOut(auth);
		// 2️ Server Action to delete the HTTP-only session cookie
		await deleteSessionCookie();
		// 3️ Redirect to the home page
		router.push("/");
	};

	return (
		<Button className="btn-logout" onClick={handleLogout}>
			Logout
		</Button>
	);
};

export default LogoutBtn;
