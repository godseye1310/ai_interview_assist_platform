"use client";
// import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.actions";
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

const AgentInterface = ({
	userName,
	userId,
	type,
	interviewId,
	questions,
}: AgentProps) => {
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

	const handleGenerateFeedback = useCallback(async () => {
		// console.log("Generate feedback here");
		// Create  server action that generates feedback

		if (!interviewId || !userId) {
			console.log("Missing interviewId or userId");
			return;
		}

		try {
			const { success, feedbackId } = await createFeedback({
				interviewId: interviewId!,
				userId: userId!,
				transcript: messages,
			});

			if (success && feedbackId) {
				router.push(`/interview/${interviewId}/feedback`);
			} else {
				console.log("Error generating feedback");
				router.push("/");
			}
		} catch (error) {
			console.log(error);
			return;
		}
	}, [interviewId, userId, messages, router]);

	useEffect(() => {
		if (callStatus === CallStatus.FINISHED) {
			if (type === "generate") {
				// router.push(`/interview/${interviewId}`);
				router.push("/");
			} else {
				//
				handleGenerateFeedback();
			}
		}
	}, [callStatus, type, interviewId, router, handleGenerateFeedback]);

	const handleCall = async () => {
		setCallStatus(CallStatus.CONNECTING);

		if (type === "generate") {
			await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
				variableValues: {
					username: userName,
					userid: userId,
				},
			});
		} else {
			// take an interview workflow
			let formattedQuestions = "";

			if (questions) {
				formattedQuestions = questions
					.map((question) => {
						return `- ${question}`;
					})
					.join("\n");
			}

			await vapi.start(interviewer, {
				variableValues: {
					questions: formattedQuestions,
				},
			});
		}
	};
	// console.log(messages);

	const handleDisconnect = async () => {
		setCallStatus(CallStatus.INACTIVE);
		vapi.stop();
	};

	const latestMessage2 =
		messages.length > 3 ? messages[messages.length - 3] : undefined;
	const latestMessage1 =
		messages.length > 2 ? messages[messages.length - 2] : undefined;
	const latestMessage = messages[messages.length - 1];

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
								key={latestMessage?.content}
								className={cn(
									"transition-opacity duration-500 opacity-0",
									"animate-fadeIn opacity-100"
								)}
							>
								{messages.length > 3 &&
									`${latestMessage2?.role} : ${latestMessage2?.content}`}
								{messages.length > 3 &&
									`${latestMessage1?.role} : ${latestMessage1?.content}`}
								{`${latestMessage.role} : ${latestMessage?.content}`}
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
