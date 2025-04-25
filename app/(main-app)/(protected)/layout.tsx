import Navbar from "@/components/Navbar";
import SessionRefresher from "@/components/SessionRefresher";
import { getAuthentication } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";

const Rootlayout = async ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated: boolean = await getAuthentication();

	if (!isAuthenticated) {
		redirect("/sign-in");
	}

	return (
		<>
			<SessionRefresher />
			<div className="root-layout">
				<Navbar />
				{children}
			</div>
		</>
	);
};

export default Rootlayout;
