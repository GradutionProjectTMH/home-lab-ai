type TextToImageReq = {
	prompt: string;
	negativePrompt: string;
	amount: number;
};

type TextToImageRes = {
	output: string[];
};
