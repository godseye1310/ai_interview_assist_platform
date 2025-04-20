import { cn } from "@/lib/utils";
import React from "react";

interface Message {
	role: "user" | "assistant" | "system";
	content: string;
}
const Chatui = ({ message }: { message: Message }) => {
	return (
		<p
			className={cn(
				" px-3 py-1 max-w-[90%] rounded-lg text-left",
				message.role === "user"
					? "bg-green-400 self-end"
					: "bg-blue-500 self-start"
			)}
		>
			{message.content}
		</p>
	);
};

export default Chatui;

// {messages.length > 3 &&
//     `${latestMessage2?.role} : ${latestMessage2?.content}`}
// {messages.length > 3 &&
//     `${latestMessage1?.role} : ${latestMessage1?.content}`}
// {`${latestMessage.role} : ${latestMessage?.content}`}

// "transition-opacity duration-500 opacity-0",
