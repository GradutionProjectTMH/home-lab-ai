import React, { HTMLAttributes } from "react";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import H3 from "./typography/h3";

export type Situation = { percent: number; duration: number };

type SpringLoadingProps = {
	situations: Situation[];
	label?: string;
	onFinished?: () => void;
} & HTMLAttributes<HTMLDivElement>;

const SpringLoading = ({
	situations,
	onFinished,
	label = "Loading",
	className,
	children,
	...props
}: SpringLoadingProps) => {
	const [springPercent, setSpringPercent] = React.useState<number>(0);
	const [isSpring, setIsSpring] = React.useState<boolean>(true);

	React.useEffect(() => {
		setSpringPercent(0);

		(async () => {
			let previousPercent = 0;
			for (const index in situations) {
				const { percent, duration } = situations[index];
				const numFrames = (duration / 1000) * 24;
				const startPercent = previousPercent;
				const percentStep = (percent - startPercent) / numFrames;

				for (let frameIndex = 1; frameIndex <= numFrames; ++frameIndex) {
					setSpringPercent(startPercent + frameIndex * percentStep);
					await new Promise((resolve) => {
						setTimeout(() => {
							resolve(null);
						}, 1000 / 24);
					});
				}

				previousPercent = percent;
			}

			setIsSpring(false);
			onFinished && onFinished();
		})();
	}, []);

	return isSpring ? (
		<Stack
			column
			className={joinTxts(
				"justify-center items-center gap-6 fixed top-0 left-0 w-screen h-screen z-50 backdrop-blur-lg bg-whiteAlpha-500",
				className,
			)}
			{...props}
		>
			<div className="relative">
				<img src={`${process.env.PUBLIC_URL}/images/logo-full-vertical.png`} />
				<div
					className="absolute top-0 left-0 w-full saturate-0 brightness-[1000%] overflow-hidden"
					style={{ height: `${100 - springPercent}%` }}
				>
					<img src={`${process.env.PUBLIC_URL}/images/logo-full-vertical.png`} />
				</div>
			</div>
			<H3 className="text-gray-500">
				{label}: {Math.round(springPercent)}%
			</H3>
		</Stack>
	) : (
		<>{children}</>
	);
};

export default SpringLoading;
