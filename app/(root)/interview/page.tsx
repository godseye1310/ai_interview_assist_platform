import AgentInterface from "@/components/AgentInterface";
import React from "react";

const page = () => {
	return (
		<>
			<h3>Interview generation page</h3>
			<AgentInterface userName="you" userId="user1" type="generate" />
		</>
	);
};

export default page;
