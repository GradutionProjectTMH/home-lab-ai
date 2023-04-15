// function from https://stackoverflow.com/a/15832662/512042
export function downloadURI(uri: string, name: string) {
	const link: HTMLAnchorElement = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	link.parentElement?.removeChild(link);
}

export function dataURIToBlob(dataURI: string) {
	const splitDataURI = dataURI.split(",");
	const byteString = splitDataURI[0].indexOf("base64") >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
	const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

	const ia = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

	return new Blob([ia], { type: mimeString });
}

export function randomArray(array: any[], seed: number = 100) {
	for (let i = 0; i < seed; ++i) {
		const index1 = Math.floor(Math.random() * array.length);
		const index2 = Math.floor(Math.random() * array.length);

		const temp = array[index1];
		array[index1] = array[index2];
		array[index2] = temp;
	}

	return array;
}

export function randomImg(width: number = 200, height: number = 200) {
	return `https://picsum.photos/seed/${Math.random()}/${width}/${height}`;
}
