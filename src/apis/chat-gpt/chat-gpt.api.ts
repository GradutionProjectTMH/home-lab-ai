import axiosHomeLab from "../../configs/homelab-server.config";

export const postChatGptApi = async (messages: MessageItem[]): Promise<ChatRes> => {
	return axiosHomeLab.post<MessageItem[], ChatRes>(`chat-gpt`, { messages });
};
