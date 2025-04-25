/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
// import { dummyInterviews } from "@/constants";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
	fetchInterviewListByUserId,
	fetchLatestInterviewsList,
} from "@/lib/actions/general.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
	const user = await getCurrentUser();

	if (!user) return <div>Loading...</div>;

	// parallel fetching using Promise.all
	const [userInterviewsList, latestInterviewsList] = await Promise.all([
		fetchInterviewListByUserId(user?.id!),
		fetchLatestInterviewsList({ userId: user?.id! }),
	]);
	// const interviewsList = await fetchInterviewListByUserId(user?.id!);
	// const latestInterviews = await fetchLatestInterviewsList({ userId: user?.id! });
	// console.log(userInterviewsList);

	const hasUserInterviews = userInterviewsList
		? userInterviewsList?.length > 0
		: false;
	const hasLatestInterviews = latestInterviewsList
		? latestInterviewsList?.length > 0
		: false;

	return (
		<>
			<section className="card-cta gap-y-5">
				<h2 className="min-[1005px]:hidden">
					Ace your interview with AI-Powered Practice and Feedback
				</h2>
				<div className="flex flex-row items-start max-md:flex-col max-md:gap-6 max-md:items-center">
					<div className="flex flex-col gap-6 max-w-lg">
						<h2 className="max-[1005px]:hidden">
							Ace your interview with AI-Powered Practice and
							Feedback
						</h2>
						<p className="text-light-100 text-lg">
							Practice on real interview questions & get instant
							feedback with our AI-powered platform.
						</p>
						<Button
							asChild
							className="btn-primary max-md:w-full max-md:m-auto"
						>
							<Link href="/interview">
								<span>Prepare an Interview</span>
							</Link>
						</Button>
					</div>

					<Image
						src="/robot.png"
						alt="ai-dude"
						width={400}
						height={400}
						className=" animate-fadeIn"
					/>
				</div>
			</section>

			<section className="flex flex-col gap-6 mt-8">
				<h2>Your Interviews</h2>

				<div className="interviews-section">
					{hasUserInterviews ? (
						userInterviewsList?.map((interview) => {
							return (
								<InterviewCard
									key={interview.id}
									{...interview}
									currentUserId={user?.id!}
								/>
							);
						})
					) : (
						<p>You haven&apos;t started any interviews yet.</p>
					)}
				</div>
			</section>

			<section className="flex flex-col gap-6 mt-8">
				<h2>Explore generated interviews</h2>

				<div className="interviews-section">
					{hasLatestInterviews ? (
						latestInterviewsList?.map((interview) => {
							return (
								<InterviewCard
									key={interview.id}
									{...interview}
									currentUserId={user?.id!}
								/>
							);
						})
					) : (
						<p>There are no new interviews yet.</p>
					)}
				</div>
			</section>
		</>
	);
};

export default page;
