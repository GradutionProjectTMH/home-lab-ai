import React, { HTMLAttributes } from "react";
import Stack from "../../components/layout/stack";
import H3 from "../../components/typography/h3";
import H4 from "../../components/typography/h4";
import Strong from "../../components/typography/strong";
import Text from "../../components/typography/text";
import { joinTxts } from "../../utils/text.util";

export const PDFSection = ({ children, className }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<Stack column className={joinTxts("gap-4 items-stretch", className)}>
			{children}
		</Stack>
	);
};

export const PDFList = ({ children, className }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<Stack column className={joinTxts("items-stretch", className)}>
			{children}
		</Stack>
	);
};

type PDFItemProps = {
	column?: boolean;
} & HTMLAttributes<HTMLDivElement>;
export const PDFItem = ({ column = false, children, className }: PDFItemProps) => {
	return (
		<Stack column={column} className={joinTxts("border-b border-gray-100", className)}>
			{children}
		</Stack>
	);
};

export const PDFKey = ({ children, className }: HTMLAttributes<HTMLParagraphElement>) => {
	return <Strong className={joinTxts("basis-1/6 px-2 text-gray-900 bg-gray-100", className)}>{children}</Strong>;
};

export const PDFValue = ({ children, className }: HTMLAttributes<HTMLParagraphElement>) => {
	return <Text className={joinTxts("basis-5/6 flex-grow px-2 text-gray-700", className)}>{children}</Text>;
};

type PDFImageProps = {
	label?: string;
	note?: string;
} & HTMLAttributes<HTMLDivElement>;
export const PDFImage = ({ label, note, children, className }: PDFImageProps) => {
	return (
		<Stack column className="gap-2 items-center flex-grow">
			{children}
			<Stack className="gap-2 text-blue-500">
				{label && <Text className="text-gray-500">{label}</Text>}
				{note && <Strong>&#091;{note}&#093;</Strong>}
			</Stack>
		</Stack>
	);
};

export const PDFHeading1 = ({ children, className }: HTMLAttributes<HTMLHeadingElement>) => {
	return <H3 className={joinTxts("text-gray-900 bg-blue-300", className)}>{children}</H3>;
};

export const PDFHeading2 = ({ children, className }: HTMLAttributes<HTMLHeadingElement>) => {
	return <H4 className={joinTxts("text-gray-900 !font-bold", className)}>{children}</H4>;
};

const Estimation = ({ children }: HTMLAttributes<HTMLHeadingElement>) => {
	return <H3 className="gray-900 bg-gray-100">{children}</H3>;
};

export default Estimation;
