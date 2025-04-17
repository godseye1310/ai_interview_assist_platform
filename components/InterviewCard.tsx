// import React from "react";
// import { getRandomInterviewCover } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";

const InterviewCard = ({
	id,
	// userId,
	role,
	type,
	level,
	techstack,
	createdAt,
	coverImage,
}: // idata,
InterviewCardProps) => {
	const feedback = null as Feedback | null;
	const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

	const formattedDate = dayjs(
		feedback?.createdAt || createdAt || Date.now()
	).format("MMM DD, YYYY");

	// console.log(idata);

	return (
		<div className="card-border w-[360px] max-sm:w-full min-h-96">
			<div className="card-interview">
				<div>
					<div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
						<p className="badge-text">{normalizedType}</p>
					</div>

					<Image
						src={coverImage!}
						alt="interview-cover"
						width={90}
						height={90}
						className="rounded-full object-fit size-[90px]"
					/>

					<h3 className="mt-3 capitalize">{role} Interview</h3>
					<span className="badge-text bg-cyan-900 px-1.5 py-0.5 rounded-lg">
						{level}
					</span>

					<div className="flex flex-row gap-5 mt-3">
						<div className="flex flex-row gap-2">
							<Image
								src="/calendar.svg"
								alt="calendar"
								width={20}
								height={20}
							/>
							<p className="mr-2">{formattedDate}</p>

							<Image
								src="/star.svg"
								alt="rating"
								width={20}
								height={20}
							/>
							<p>{feedback?.totalScore || "__"}/100</p>
						</div>
					</div>

					<p className="line-clamp-2 mt-5">
						{feedback?.finalAssessment ||
							"You haven't started this interview yet."}
					</p>
				</div>

				<div className="flex flex-row justify-between">
					{/* Tech Icons */}
					<DisplayTechIcons techStack={techstack} />

					<Button className="btn-primary">
						<Link
							href={
								feedback
									? `/interview/${id}/feedback`
									: `/interview/${id}`
							}
						>
							{feedback ? "Check Feedback" : "Start Interview"}
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default InterviewCard;
