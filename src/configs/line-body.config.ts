import { routes } from "../pages/navigator";

export type LineName = "HLine1" | "HLine2" | "VLine1" | "VLine2" | "VLine3";
type ListPage = typeof routes[number]["name"];

export const lineByRoutes: Record<ListPage, Record<LineName, string> | null> = {
	Home: {
		HLine1: "bg-gray-300 top-48",
		HLine2: "bg-gray-300 top-[44rem]",
		VLine1: "bg-gray-300 left-1/2",
		VLine2: "",
		VLine3: "",
	},
	Build: {
		HLine1: "bg-gray-300 top-44",
		HLine2: "bg-gray-300 top-[44rem]",
		VLine1: "bg-gray-300 left-0",
		VLine2: "bg-gray-300 right-0",
		VLine3: "",
	},
	Order: {
		HLine1: "bg-gray-300 top-48",
		HLine2: "bg-gray-300 top-[36rem]",
		VLine1: "bg-gray-300 left-0",
		VLine2: "bg-gray-300 right-0",
		VLine3: "",
	},
	Marketplace: {
		HLine1: "bg-gray-300 top-36",
		HLine2: "bg-gray-300 top-[29.2rem]",
		VLine1: "bg-gray-300 left-0",
		VLine2: "bg-gray-300 left-1/2 !h-[29.2rem]",
		VLine3: "bg-gray-300 right-0",
	},
	DetailDrawing: {
		HLine1: "bg-gray-300 top-36",
		HLine2: "",
		VLine1: "bg-gray-300 left-0",
		VLine2: "",
		VLine3: "bg-gray-300 right-0",
	},
	RequestVerify: {
		HLine1: "bg-gray-300 top-36",
		HLine2: "",
		VLine1: "bg-gray-300 left-0",
		VLine2: "",
		VLine3: "bg-gray-300 right-0",
	},
	VerifyMaterial: {
		HLine1: "bg-gray-300 top-36",
		HLine2: "",
		VLine1: "bg-gray-300 left-0",
		VLine2: "",
		VLine3: "bg-gray-300 right-0",
	},
};
