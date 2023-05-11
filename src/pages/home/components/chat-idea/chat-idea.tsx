import * as React from "react";
import Stack from "../../../../components/layout/stack";
import H3 from "../../../../components/typography/h3";
import Text from "../../../../components/typography/text";
import { Image } from "../../../../components/image";
import { randomImg } from "../../../../utils/tools.util";
import Input from "../../../../components/input";
import Button from "../../../../components/button";
import { joinTxts } from "../../../../utils/text.util";

import style from "./style.module.css";
import { Textarea } from "../../../../components/textarea";
import ButtonIcon from "../../../../components/button-icon";
import { Transition } from "@headlessui/react";

export const ChatIdea = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<Stack column className={joinTxts("bg-white shadow-lg rounded-lg", className)}>
			<H3 className="text-dark px-8 py-4 border-b border-gray-200">HomeLab.ai Chat</H3>
			<Stack column className="grow">
				<Stack className="gap-4 p-8 pr-20 bg-light">
					<div className="shrink-0 w-16 h-16">
						<Image src={randomImg(64, 64)} className="w-full h-full rounded-full shadow" />
					</div>
					<Text>
						Để thiết kế một ngôi nhà hiện đại, phù hợp với lối sống tối giản và màu sắc hài hòa, bạn có thể thực hiện
						các bước sau: Thu thập thông tin: Bạn nên tìm hiểu về kiến trúc hiện đại và các tiêu chí cơ bản của thiết
						kế, đặc biệt là lối sống tối giản và sự hài hòa về màu sắc. Bạn nên thu thập thông tin về các vật liệu xây
						dựng, cách bố trí không gian, ánh sáng, màu sắc, và các chi tiết khác để có được những ý tưởng và tiêu chí
						cho thiết kế ngôi nhà của bạn. Thiết kế tổng thể: Bạn nên lên ý tưởng cho kiểu dáng tổng thể của ngôi nhà,
						bao gồm kích thước, hình dạng và bố trí. Bạn cần phải xác định các yếu tố chính như số tầng, phân bổ các
						không gian chức năng, địa hình, hướng nhà, v.v...
					</Text>
				</Stack>
				<Stack className="gap-4 p-8 pl-20">
					<div className="shrink-0 w-16 h-16 order-2">
						<Image src={randomImg(64, 64)} className="w-full h-full rounded-full shadow" />
					</div>
					<Text className="text-right order-1">
						Để thiết kế một ngôi nhà hiện đại, phù hợp với lối sống tối giản và màu sắc hài hòa, bạn có thể thực hiện
						các bước sau: Thu thập thông tin: Bạn nên tìm hiểu về kiến trúc hiện đại và các tiêu chí cơ bản
					</Text>
				</Stack>
			</Stack>
			<Stack className="justify-between items-center px-8 py-2 border-t border-gray-200 gap-8">
				<Textarea className="grow border-none resize-none !ring-0" />
				<Stack className="shrink-0 gap-2">
					<ButtonIcon remixIconName="send-plane-line" iconClassName="text-3xl text-gray-700" className="w-16 h-16" />
					<ButtonIcon
						remixIconName="pencil-ruler-2-line"
						iconClassName="text-3xl text-blue-500"
						className="w-16 h-16"
					/>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default ChatIdea;
