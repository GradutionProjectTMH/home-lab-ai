import { Carousel } from "flowbite-react";
import React from "react";

interface SliderProps {
	images: string[];
}

const Slider = ({ images }: SliderProps) => {
	return (
		<Carousel>
			{images.map((image, index) => (
				<img src={image} alt="..." key={index} className="object-cover w-full h-full" />
			))}
		</Carousel>
	);
};

export default Slider;
