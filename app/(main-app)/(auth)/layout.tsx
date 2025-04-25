import { getAuthentication } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";

const Authlayout = async ({ children }: { children: React.ReactNode }) => {
	const isAuthenticated: boolean = await getAuthentication();

	if (isAuthenticated) {
		redirect("/home");
	}
	return <div className="auth-layout">{children}</div>;
};

export default Authlayout;
