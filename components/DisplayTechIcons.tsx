import { cn, getTechLogos } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
	const techIcons = await getTechLogos(techStack);
	// console.log(techIcons);
	const techStackIcons = techIcons.slice(0, 3).map((icon, i) => (
		<div
			key={i}
			className={cn(
				"relative group bg-dark-300 rounded-full p-2 flex-center",
				i >= 1 && "-ml-5"
			)}
		>
			<span className="tech-tooltip">{icon.tech}</span>
			<Image
				src={icon.url}
				alt={icon.tech}
				width={100}
				height={100}
				className="size-5"
			/>
		</div>
	));

	return <div className="flex flex-row gap-2">{techStackIcons}</div>;
};

export default DisplayTechIcons;
