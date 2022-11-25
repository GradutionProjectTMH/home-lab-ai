import React from "react";
import { ReactImageGalleryProps } from "react-image-gallery";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";

interface SliderProps extends Partial<ReactImageGalleryProps> {
	images: string[];
}

const Slider = ({ images, ...props }: SliderProps) => {
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
	return (
		<ImageGallery
			showThumbnails={false}
			items={data}
			slideInterval={3000}
			autoPlay
			showPlayButton={false}
			showFullscreenButton={false}
			{...props}
		/>
	);
};

export default Slider;
