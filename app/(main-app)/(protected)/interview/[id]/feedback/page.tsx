// import React from 'react'

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId } from "@/lib/actions/general.actions";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

const page = async ({ params }: RouteParams) => {
	const { id } = await params;
	// console.log(id);
	const user = await getCurrentUser();

	const feedback = await getFeedbackByInterviewId({
		interviewId: id,
		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		userId: user?.id!,
	});

	console.log({ userid: user?.id, interviewId: id });

	// console.log(feedback);

	const formattedDate = dayjs(feedback?.createdAt).format("MMM DD, YYYY");

	return (
		<div className="flex flex-col gap-4 justify-center items-center">
			<h2 className="text-center">Interview Feedback</h2>
			<h1>Interview Id: {id}</h1>

			<div className="flex flex-row gap-5 mt-3">
				<div className="flex flex-row gap-3">
					<Image
						src="/star.svg"
						alt="rating"
						width={20}
						height={20}
					/>
					<p>
						Overall Impression:{" "}
						<span className="font-bold ml-0.5">
							{feedback?.totalScore}
						</span>
						/100
					</p>

					<Image
						src="/calendar.svg"
						alt="calendar"
						width={20}
						height={20}
					/>
					<p className="mr-2">{formattedDate}</p>
				</div>
			</div>

			<hr className=" w-full my-4 border-dark-300 " />

			<div className="flex flex-col gap-y-9 justify-center">
				<div>
					<h3 className="mb-4">
						Final Verdict:
						<span
							className={cn(
								"bg-dark-300 rounded-3xl px-3 py-1 ml-1.5 text-lg ",
								feedback && feedback.totalScore > 85
									? "text-green-400"
									: "text-red-400"
							)}
						>
							{feedback && feedback?.totalScore > 81
								? "Recommended"
								: "Not Recommended"}
						</span>
					</h3>
					<p className="font-semibold">{feedback?.finalAssessment}</p>
				</div>

				<div>
					<h3 className="mb-4">Breakdown of Interview Assessment</h3>

					<ol className="flex flex-col gap-4 list-decimal">
						{feedback?.categoryScores.map((category, i) => {
							return (
								<li
									key={i}
									className="list-decimal list-inside"
								>
									<h5 className="text-primary-100 font-bold inline">
										{category.name}{" "}
										<span>({category.score}/100)</span>
									</h5>
									<p className="text-neutral-300">
										{category.comment}
									</p>
								</li>
							);
						})}
					</ol>
				</div>

				<div>
					<h3 className="mb-3">Strengths</h3>
					<p className="text-neutral-300">{feedback?.strengths}</p>
				</div>

				<div>
					<h3 className="mb-3">Areas for Improvement</h3>
					{/* <p>{feedback?.areasForImprovement}</p> */}
					<ul className="flex flex-col gap-y-2">
						{feedback?.areasForImprovement.map(
							(areaToImprove, i) => {
								return (
									<li key={i}>
										<p className="text-neutral-300 inline">
											{areaToImprove}
										</p>
									</li>
								);
							}
						)}
					</ul>
				</div>
			</div>

			<div className="flex flex-row gap-6 mt-3 pt-3 justify-center items-center py-3 max-sm:flex-col">
				<Link
					href="/"
					className="bg-dark-200 rounded-3xl px-9 py-1.5 font-semibold text-primary-100"
				>
					Back to Dashboard
				</Link>

				<Link
					href={`/interview/${id}`}
					className="bg-primary-200 rounded-3xl px-9 py-1.5 font-semibold text-dark-300"
				>
					Retake Interview
				</Link>
			</div>
		</div>
	);
};

export default page;
