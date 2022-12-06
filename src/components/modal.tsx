import React from "react";
import { joinTxts } from "../utils/text.util";
import Stack from "./layout/stack";
import H3 from "./typography/h3";

interface ModalProps extends React.HTMLAttributes<HTMLElement> {
	title?: string | undefined;
	isShown: boolean;
	onClose: () => void;
	withFull?: boolean;
}

const Modal = ({ title, isShown, children, onClose, withFull = false }: ModalProps) => {
	return (
		<div
			className={joinTxts(
				"fixed bg-blackAlpha-400 overflow-y-auto overflow-x-hidden top-0 right-0 left-0 md:inset-0 h-screen z-50 ",
				!isShown ? "hidden" : "",
			)}
		>
			<div
				className={joinTxts("relative py-4 w-full h-full md:max-w-6xl mx-auto", withFull ? "md:max-w-full px-4" : "")}
			>
				<Stack column className="relative bg-gray-50 rounded-lg shadow h-full">
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
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							></path>
						</svg>
						<span className="sr-only">Close modal</span>
					</button>

					{title && (
						<>
							<H3 className="px-4 py-3">{title}</H3>
							<div className="h-[1px] bg-gray-200"></div>
						</>
					)}

					<Stack className="flex-grow overflow-y-scroll">{children}</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default Modal;
