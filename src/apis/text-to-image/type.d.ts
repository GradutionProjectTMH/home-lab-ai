type TextToImageReq = {
	prompt: string;
	negativePrompt: string;
	amount: number;
	width?: string;
	height?: string;
};

type TextToImageRes = {
	output: string[];
};
