import * as React from "react";
import Stack from "../../../../components/layout/stack";
import H3 from "../../../../components/typography/h3";
import Text from "../../../../components/typography/text";
import { Image } from "../../../../components/image";
import { randomImg } from "../../../../utils/tools.util";
import Input from "../../../../components/input";
import Button from "../../../../components/button";
import { joinTxts } from "../../../../utils/text.util";
import { Textarea } from "../../../../components/textarea";
import ButtonIcon from "../../../../components/button-icon";
import { Transition } from "@headlessui/react";
import mascotPng from "./images/mascot.png";
import engineerPng from "./images/engineer.png";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { postChatGptApi } from "../../../../apis/chat-gpt/chat-gpt.api";

import style from "./style.module.css";
import { Animation } from "../../../../components/animation";
import { useDispatch } from "react-redux";
import { pushError } from "../../../../redux/slices/message.slice";
import { AxiosError } from "axios";

type ChatFields = {
	message: string;
};

export const ChatIdea = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ChatFields>();

	const messageAreaRef = React.useRef<HTMLDivElement>(null);

	const [chatMessages, setChatMessages] = React.useState<MessageItem[]>([
		{
			role: "assistant",
			content:
				"Chào bạn, mình là HomeLabChat. Hãy xây dựng ý tưởng xây dựng ngôi nhà bằng một đoạn mô tả ngôi nhà của bạn nhé!",
		},
	]);

	const { mutateAsync: postChatGpt, isLoading: isLoadingPostChatGpt } = useMutation(postChatGptApi, {
		onSuccess: (chatRes) => {
			setTimeout(() => {
				setChatMessages([...chatMessages, chatRes.message]);
			}, 1000);
		},
		onError: (error: AxiosError<{ message: string }>) => {
			dispatch(pushError(error?.message));
		},
	});

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (messageAreaRef.current) {
				messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
			}
		}, 100);

		return () => clearTimeout(timeoutId);
	}, [isLoadingPostChatGpt, chatMessages]);

	const handleValidSubmit = ({ message }: ChatFields) => {
		const newChatMessages: MessageItem[] = [...chatMessages, { role: "user", content: message }];
		setChatMessages(newChatMessages);
		postChatGpt(newChatMessages);
		setValue("message", "");
	};

	const renderMessage = (messageItem: MessageItem) => {
		switch (messageItem.role) {
			case "user":
				return (
					<Animation animation={[{ name: "zoomIn", duration: "0.6s" }]}>
						<Stack className="items-center gap-4 p-8 pr-20 bg-light">
							<div className="shrink-0 w-16 h-16">
								<Image src={engineerPng} className="w-full h-full rounded-full shadow" />
							</div>
							<Text>{messageItem.content}</Text>
						</Stack>
					</Animation>
				);

			case "assistant":
			case "system":
				return (
					<Animation animation={[{ name: "zoomIn", duration: "0.6s" }]}>
						<Stack className="justify-end items-center gap-4 p-8 pl-20">
							<div className="shrink-0 w-16 h-16 order-2">
								<Image src={mascotPng} className="w-full h-full rounded-full shadow" />
							</div>
							<Text className="text-right order-1">{messageItem.content}</Text>
						</Stack>
					</Animation>
				);

			default:
				return;
		}
	};

	return (
		<Stack column className={joinTxts("bg-white shadow-lg rounded-lg", className)}>
			<H3 className="text-dark px-8 py-4 border-b border-gray-200">HomeLab.ai Chat</H3>
			<Stack ref={messageAreaRef} column className="grow overflow-y-scroll">
				{chatMessages.map((messageItem) => renderMessage(messageItem))}

				<Transition
					as={React.Fragment}
					show={isLoadingPostChatGpt}
					enter="transition duration-1000"
					enterFrom="opacity-0 scale-75"
					enterTo="opacity-100 scale-100"
					leave="transition duration-1000"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-75"
				>
					<Stack className="justify-end items-center gap-4 p-8 pl-20">
						<div className="relative shrink-0 w-16 h-16 order-2">
							<Image src={mascotPng} className="relative w-full h-full rounded-full shadow" />
							<div className="absolute animate-ping top-0 right-0 rounded-full w-4 h-4 bg-primary" />
							<div className="absolute top-0 right-0 rounded-full w-4 h-4 bg-primary" />
						</div>
						<Text className="text-right order-1 text-gray-500">Đang xử lí</Text>
					</Stack>
				</Transition>
			</Stack>

			<form onSubmit={handleSubmit(handleValidSubmit)}>
				<Stack className="justify-between items-center px-8 py-4 border-t border-gray-200 gap-8">
					<div className="relative grow">
						<input
							className="w-full p-2 !border-none !ring-0"
							{...register("message", { required: true })}
							disabled={isLoadingPostChatGpt}
						/>
						{errors.message && <Text className="absolute text-red-500">Vui lòng nhập nội dung</Text>}
					</div>
					<Stack className="shrink-0 gap-2">
						<ButtonIcon
							typeButton="submit"
							remixIconName="send-plane-line"
							iconClassName="text-3xl text-gray-700"
							className="w-16 h-16"
							disabled={isLoadingPostChatGpt}
						/>
						<ButtonIcon
							remixIconName="pencil-ruler-2-line"
							iconClassName="text-3xl text-blue-500"
							className="w-16 h-16"
							disabled={isLoadingPostChatGpt}
						/>
					</Stack>
				</Stack>
			</form>
		</Stack>
	);
};

export default ChatIdea;
