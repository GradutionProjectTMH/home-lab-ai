import jsPDF, { HTMLFontFace } from "jspdf";

const pdfDoc = new jsPDF("portrait", "px", "a4");

export const fontFaces: HTMLFontFace[] = [
	{
		family: "Be Vietnam Pro",
		style: "normal",
		weight: "normal",
		src: [
			{
				url: `${process.env.PUBLIC_URL}/fonts/Be_Vietnam_Pro/BeVietnamPro-Medium.ttf`,
				format: "truetype",
			},
		],
	},
	{
		family: "Be Vietnam Pro",
		style: "italic",
		weight: "normal",
		src: [
			{
				url: `${process.env.PUBLIC_URL}/fonts/Be_Vietnam_Pro/BeVietnamPro-MediumItalic.ttf`,
				format: "truetype",
			},
		],
	},
	{
		family: "Be Vietnam Pro",
		style: "normal",
		weight: "700",
		src: [
			{
				url: `${process.env.PUBLIC_URL}/fonts/Be_Vietnam_Pro/BeVietnamPro-ExtraBold.ttf`,
				format: "truetype",
			},
		],
	},
];

export default pdfDoc;
