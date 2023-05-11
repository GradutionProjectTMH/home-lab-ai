import React, { useEffect, useRef, useState } from "react";

export const Animation = ({
	watching,
	animation = [],
	onAnimating = () => {},
	onAnimated = () => {},
	className,
	style,
	children,
	...props
}: AnimationProps) => {
	const refContainer = useRef<HTMLDivElement>(null);
	const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

	const handleAnimationEnded = () => {
		const newAnimationIndex = currentAnimationIndex + 1;
		onAnimated(newAnimationIndex >= animation.length, animation[currentAnimationIndex]);
		setCurrentAnimationIndex(newAnimationIndex);
	};

	useEffect(() => {
		setCurrentAnimationIndex(animation ? 0 : -1);
		onAnimating(animation[0]);
	}, [watching, (animation || []).map((item) => item.name).join("-")]);

	useEffect(() => {
		const container = refContainer.current!;

		const currentAnimation = animation[currentAnimationIndex];
		if (!currentAnimation) return;

		const { name, duration, timingFunction, delay, direction } = currentAnimation;

		container.style.animationPlayState = "paused";
		container.style.animationName = "none";

		void container.offsetWidth; // Trigger reflow

		container.style.animationPlayState = "running";
		container.style.animationName = name;
		container.style.animationDuration = duration || "1s";
		container.style.animationDelay = delay || "0s";
		container.style.animationTimingFunction = timingFunction || "ease-out";
		console.log(direction);

		container.style.animationDirection = direction || "normal";
	}, [currentAnimationIndex]);

	return (
		<div
			ref={refContainer}
			className={className}
			style={{ animationFillMode: "both", ...style }}
			onAnimationEnd={handleAnimationEnded}
			{...props}
		>
			{children}
		</div>
	);
};
