import "../globals.css";
import { getAuthentication } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import React from "react";

const LandingPagelayout = async ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const isAuthenticated: boolean = await getAuthentication();

	if (isAuthenticated) {
		redirect("/home");
	} else {
		// can remove this line if you build the landing page
		redirect("/sign-in");
	}

	return (
		<html lang="en" className="dark">
			<body className={`antialiased pattern`}>
				<div className="root-layout">{children}</div>
			</body>
		</html>
	);
};

export default LandingPagelayout;
