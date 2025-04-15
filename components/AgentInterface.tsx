"use client";
// import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
// import { toast } from "sonner";

enum CallStatus {
	INACTIVE = "INACTIVE",
	CONNECTING = "CONNECTING",
	ACTIVE = "ACTIVE",
	FINISHED = "FINISHED",
}

interface SavedMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

const AgentInterface = ({ userName, userId, type }: AgentProps) => {
	const router = useRouter();

	const [isSpeaking, setIsSpeaking] = useState(false);
	const [callStatus, setCallStatus] = useState<CallStatus>(
		CallStatus.INACTIVE
	);
	const [messages, setMessages] = useState<SavedMessage[]>([]);

	useEffect(() => {
		const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
		const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
		const onMessage = (message: Message) => {
			if (
				message.type === "transcript" &&
				message.transcriptType === "final"
			) {
				const newMessage = {
					role: message.role,
					content: message.transcript,
				};
				setMessages((prev) => [...prev, newMessage]);
			}
		};

		const onSpeechStart = () => setIsSpeaking(true);
		const onSpeechEnd = () => setIsSpeaking(false);

		const onError = (error: Error) => {
			console.log("Error:", error);
			// toast.error(error.message);
		};

		vapi.on("call-start", onCallStart);
		vapi.on("call-end", onCallEnd);
		vapi.on("message", onMessage);
		vapi.on("speech-start", onSpeechStart);
		vapi.on("speech-end", onSpeechEnd);
		vapi.on("error", onError);

		return () => {
			vapi.off("call-start", onCallStart);
			vapi.off("call-end", onCallEnd);
			vapi.off("message", onMessage);
			vapi.off("speech-start", onSpeechStart);
			vapi.off("speech-end", onSpeechEnd);
			vapi.off("error", onError);
		};
	}, []);

	useEffect(() => {
		if (callStatus === CallStatus.FINISHED) {
			router.push("/");
		}
	}, [messages, callStatus, type, userId, router]);

	const handleCall = async () => {
		setCallStatus(CallStatus.CONNECTING);

		await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
			variableValues: {
				username: userName,
				userid: userId,
			},
		});
	};

	const handleDisconnect = async () => {
		setCallStatus(CallStatus.INACTIVE);
		vapi.stop();
	};

	const latestMessage = messages[messages.length - 1]?.content;

	const isCallInActiveOrFinished =
		callStatus === CallStatus.INACTIVE ||
		callStatus === CallStatus.FINISHED;

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
						<h3>{userName}</h3>
					</div>
				</div>
			</div>

			<div>
				{messages.length > 0 && (
					<div className="transcript-border">
						<div className="transcript">
							<p
								key={latestMessage}
								className={cn(
									"transition-opacity duration-500 opacity-0",
									"animate-fadeIn opacity-100"
								)}
							>
								{latestMessage}
							</p>
						</div>
					</div>
				)}
			</div>

			<div className="w-full flex justify-center">
				{callStatus !== "ACTIVE" ? (
					<button onClick={handleCall} className="relative btn-call">
						<span
							className={cn(
								"absolute animate-ping rounded-full opacity-75",
								callStatus !== "CONNECTING" && "hidden"
							)}
						/>
						<span>
							{isCallInActiveOrFinished ? "Call" : ". . ."}
						</span>
					</button>
				) : (
					<button
						onClick={handleDisconnect}
						className="btn-disconnect"
					>
						End
					</button>
				)}
			</div>
		</>
	);
};

export default AgentInterface;
