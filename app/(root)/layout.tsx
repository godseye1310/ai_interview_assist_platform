import { getAuthentication } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Rootlayout = async ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated: boolean = await getAuthentication();

	if (!isAuthenticated) {
		redirect("/sign-in");
	}

	return (
		<div className="root-layout">
			<nav>
				<Link
					href="/"
					className="flex items-center gap-2 text-primary-100"
				>
					<Image src="/logo.svg" alt="logo" width={38} height={32} />
					<h2 className="">VoicePrep</h2>
				</Link>
			</nav>
			{children}
		</div>
	);
};

export default Rootlayout;
