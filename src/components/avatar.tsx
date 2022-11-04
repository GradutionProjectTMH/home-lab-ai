import React from "react";
import Stack from "./layout/stack";

interface IAvatar {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
}

const Avatar = ({ src, height = 45, width = 45, alt = "" }: IAvatar) => {
	return (
		<Stack className="justify-center items-center">
			<Stack className="rounded-full border-white border-2 overflow-hidden " style={{ width, height }}>
				<img className="object-cover" src={src} alt={alt} width={width} height={height} />
			</Stack>
		</Stack>
	);
};

export default Avatar;
