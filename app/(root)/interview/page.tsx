import AgentInterface from "@/components/AgentInterface";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const page = async () => {
	const user = await getCurrentUser();
	// console.log(user);
	return (
		<>
			<h3>Interview generation page</h3>
			<AgentInterface
				userName={user?.name}
				userId={user?.id}
				type="generate"
			/>
		</>
	);
};

export default page;
