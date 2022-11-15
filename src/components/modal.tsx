import React from "react";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import H3 from "./typography/h3";

interface ModalProps extends React.HTMLAttributes<HTMLElement> {
	title: string;
	isShown: boolean;
	onClose: () => void;
}

const Modal = ({ title, isShown, children, onClose }: ModalProps) => {
	return (
		<div
			className={joinTxts(
				"fixed bg-blackAlpha-400 overflow-y-auto overflow-x-hidden top-0 right-0 left-0 md:inset-0 h-modal md:h-full z-50",
				!isShown ? "hidden" : "",
			)}
		>
			<div className="relative p-4 w-full h-full md:max-w-6xl md:h-auto mx-auto">
				<div className="relative bg-gray-50 rounded-lg shadow dark:bg-gray-700">
					<button
						type="button"
						className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
						onClick={onClose}
					>
						<svg
							aria-hidden="true"
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path>
						</svg>
						<span className="sr-only">Close modal</span>
					</button>

					<H3 className="px-4 py-3">{title}</H3>
					<div className="h-[1px] bg-gray-200"></div>

					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;
