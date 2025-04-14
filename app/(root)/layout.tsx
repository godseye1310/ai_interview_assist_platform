import Image from "next/image";
import Link from "next/link";
import React from "react";

const Rootlayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="root-layout">
			<nav>
				<Link
					href="/"
					className="flex items-center gap-2 text-primary-100"
				>
					<Image src="/logo.svg" alt="logo" width={38} height={32} />
					<h2 className="">Prepwise</h2>
				</Link>
			</nav>
			{children}
		</div>
	);
};

export default Rootlayout;
