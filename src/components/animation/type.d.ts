type AnimationItem = {
	name: string;
	duration?: string;
	timingFunction?: string;
	delay?: string;
	direction?: string;
};

interface AnimationProps extends React.HTMLAttributes<HTMLDivElement> {
	watching?: any;
	animation?: AnimationItem[];
	onAnimating?: (currentAnimation: AnimationItem) => void;
	onAnimated?: (isLastAnimation: boolean, currentAnimation: AnimationItem) => void;
}
