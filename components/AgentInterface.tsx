// import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

enum CallStatus {
	INACTIVE = "INACTIVE",
	CONNECTING = "CONNECTING",
	ACTIVE = "ACTIVE",
	FINISHED = "FINISHED",
}

const messages = [
	"Hello, I'm here to help you with your interview preparation.",
	"Can I get your name please?",
	"Sure, The name is John Doe.",
];

const lastMessage = messages[messages.length - 1];

const AgentInterface = ({ userName }: AgentProps) => {
	const callStatus = CallStatus.FINISHED;
	const isSpeaking = true;
	return (
		<>
			<div className="call-view">
				{/* AI Agent Interface */}
				<div className="card-interviewer">
					<div className="avatar">
						<Image
							src={"/ai-avatar.png"}
							alt="avatar vapi"
							width={65}
							height={54}
							className="object-cover"
						/>
						{isSpeaking && <span className="animate-speak" />}
					</div>
					<h3>AI Interviewer</h3>
				</div>

				{/* Interviewee Interface */}
				<div className="card-border">
					<div className="card-content">
						<Image
							src={"/user-avatar.png"}
							alt="user avatar"
							width={540}
							height={540}
							className="rounded-full object-cover size-36"
						/>
						{isSpeaking && <span className="animate-speak" />}
						<h3>Interviewee</h3>
					</div>
				</div>
			</div>

			<div>
				{messages.length && (
					<div className="transcript-border">
						<div className="transcript">
							<p
								key={lastMessage}
								className={cn(
									"transition-opacity duration-500 opacity-0",
									"animate-fadeIn opacity-100"
								)}
							>
								{lastMessage}
							</p>
						</div>
					</div>
				)}
			</div>

			<div className="w-full flex justify-center">
				{callStatus !== "ACTIVE" ? (
					<button className="relative btn-call">
						<span
							className={cn(
								"absolute animate-ping rounded-full opacity-75",
								callStatus !== "CONNECTING" && "hidden"
							)}
						/>
						<span>
							{callStatus === "INACTIVE" ||
							callStatus === "FINISHED"
								? "Call"
								: ". . ."}
						</span>
					</button>
				) : (
					<button className="btn-disconnect">End</button>
				)}
			</div>
		</>
	);
};

export default AgentInterface;
