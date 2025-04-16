import { db } from "@/firebase/admin";

export async function fetchInterviewListByUserId(
	userId: string
): Promise<Interview[] | null> {
	const interviews = await db
		.collection("interviews")
		.where("userId", "==", userId)
		.orderBy("createdAt", "desc")
		.get();

	return interviews.docs.map((doc) => {
		return {
			id: doc.id,
			...doc.data(),
		};
	}) as Interview[];
}

export async function fetchLatestInterviewsList(
	params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
	const { userId, limit = 6 } = params;

	const interviews = await db
		.collection("interviews")
		.orderBy("createdAt", "desc")
		.where("finalized", "==", true)
		.where("userId", "!=", userId)
		.limit(limit)
		.get();

	return interviews.docs.map((doc) => {
		return {
			id: doc.id,
			...doc.data(),
		};
	}) as Interview[];
}
