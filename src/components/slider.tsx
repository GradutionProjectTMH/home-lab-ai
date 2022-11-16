import React from "react";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";

interface SliderProps {
	images: string[];
}

const Slider = ({ images }: SliderProps) => {
	const imagesssss = [
		{
			original: "https://picsum.photos/id/1018/1000/600/",
			thumbnail: "https://picsum.photos/id/1018/250/150/",
		},
		{
			original: "https://picsum.photos/id/1015/1000/600/",
			thumbnail: "https://picsum.photos/id/1015/250/150/",
		},
		{
			original: "https://picsum.photos/id/1019/1000/600/",
			thumbnail: "https://picsum.photos/id/1019/250/150/",
		},
	];

	const data: ReactImageGalleryItem[] = images.map((image) => {
		return {
			original: image,
			thumbnail: image,
		};
	});
	return <ImageGallery items={data} showPlayButton={false} showFullscreenButton={false} />;
};

export default Slider;
