import Image from "next/image";
import Link from "next/link";
import React from "react";
import LogoutBtn from "./LogoutBtn";

const Navbar = () => {
	return (
		<nav className="flex items-center justify-between">
			<Link href="/" className="flex items-center gap-2 text-primary-100">
				<Image src="/logo.svg" alt="logo" width={38} height={32} />
				<h2 className="">VoicePrep</h2>
			</Link>

			<LogoutBtn />
		</nav>
	);
};

export default Navbar;
