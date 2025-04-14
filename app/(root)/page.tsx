import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
	return (
		<>
			<section className="card-cta">
				<div className="flex flex-col gap-6 max-w-lg">
					<h2 className="">
						Get Interview Ready with AI Powered Practice and
						feedback
					</h2>
					<p className="text-light-100 text-lg">
						Get instant feedback on your answers and practice your
						interview skills with our AI powered practice tool.
					</p>
					<Button asChild className="btn-primary max-sm:w-full">
						<Link href="/interview">
							<span>Start an Interview</span>
						</Link>
					</Button>
				</div>
				<Image
					src="/robot.png"
					alt="ai-dude"
					width={400}
					height={400}
					className="max-sm:hidden animate-fadeIn"
				/>
			</section>

			<section className="flex flex-col gap-6 mt-8">
				<h2>Your Interviews</h2>

				<div className="interviews-section">
					{dummyInterviews.map((interview) => {
						return (
							<InterviewCard key={interview.id} {...interview} />
						);
					})}

					{/* <p>You haven&apos;t started any interviews yet.</p> */}
				</div>
			</section>

			<section className="flex flex-col gap-6 mt-8">
				<h2>Take an Interview</h2>

				<div className="interviews-section">
					{dummyInterviews.map((interview) => (
						<InterviewCard key={interview.id} {...interview} />
					))}
					{/* <p>There are no interviews yet.</p> */}
				</div>
			</section>
		</>
	);
};

export default page;
