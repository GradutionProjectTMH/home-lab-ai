export const matchArea = (x: number, y: number, xStart: number, xEnd: number, yStart: number, yEnd: number) => {
	return xStart < x && x < xEnd && yStart < y && y < yEnd;
};
