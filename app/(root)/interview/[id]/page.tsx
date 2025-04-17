// import React from 'react'

import AgentInterface from "@/components/AgentInterface";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { fetchInterviewById } from "@/lib/actions/general.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

const page = async ({ params }: RouteParams) => {
	// when creating a dynamic route in next.js, we can extract the id from the url using the params object
	const { id } = await params;
	const interview = await fetchInterviewById(id);

	const user = await getCurrentUser();

	if (!interview) redirect("/");

	return (
		<>
			{/* <h6>Interview details page for interview id {id}</h6> */}
			<div className="flex flex-row gap-4 justify-between">
				<div className="flex flex-row gap-4 items-center max-sm:flex-col">
					<div className="flex flex-row gap-4 items-center">
						<Image
							src={interview?.coverImage}
							alt="cover-image"
							width={40}
							height={40}
							className="rounded-full object-cover size-[40px]"
						/>
						<h3 className="capitalize">
							{interview.role} Interview
						</h3>
					</div>
					<DisplayTechIcons techStack={interview.techstack} />
				</div>

				<p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
					{interview.type}
				</p>
			</div>

			<AgentInterface
				userName={user?.name}
				userId={user?.id}
				type="interview"
				// type={interview.type}
				interviewId={id}
				questions={interview.questions}
			/>
		</>
	);
};

export default page;
