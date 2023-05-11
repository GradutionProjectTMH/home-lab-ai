type MessageItem = {
	role: "system" | "user" | "assistant";
	content: string;
};

type ChatRes = {
	message: MessageItem;
	finish_reason: string;
	index: number;
};
