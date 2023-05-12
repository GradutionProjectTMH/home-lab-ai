import { store } from "../redux/stores/store.redux";
import { AddResult } from "ipfs-core-types/src/root";

// export type FileContent =
// 	| Uint8Array
// 	| Blob
// 	| String
// 	| Iterable<Uint8Array>
// 	| AsyncIterable<Uint8Array>
// 	| ReadableStream<Uint8Array>;

// const getIPFSUrlFromPath = (path: string) => {
// 	return `ipfs://${path}`;
// };

// const getIPFSPath = (url: string) => {
// 	return url.replace("ipfs://", "");
// };

// const getIPFSClient = (ipfsUrl: string) => {
// 	const env = store.getState().environment;
// 	return ipfsUrl.replace("ipfs://", env.infura.DEDICATED_GATEWAY_SUBDOMAIN!);
// };

// const upload = (path: string, content?: FileContent): Promise<AddResult> => {
// 	const ipfs = store.getState().ipfsService!;

// 	return ipfs.add({
// 		// The path you want the file to be accessible at from the root CID _after_ it has been added
// 		path,
// 		// The contents of the file (see below for definition)
// 		content,
// 		// File mode to store the entry with (see https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation)
// 		mode: "-r--r--r--",
// 		// The modification time of the entry (see below for definition)
// 		mtime: new Date(),
// 	});
// };

// const uploadMany = async (
// 	files: { path: string; content?: FileContent }[],
// ): Promise<{ directory: AddResult; files: AddResult[] }> => {
// 	const ipfs = store.getState().ipfsService!;

// 	const filesData = files.map(({ path, content }) => ({
// 		// The path you want the file to be accessible at from the root CID _after_ it has been added
// 		path: path.trim().replace(/\s+/g, "_"),
// 		// The contents of the file (see below for definition)
// 		content,
// 		// File mode to store the entry with (see https://en.wikipedia.org/wiki/File_system_permissions#Numeric_notation)
// 		mode: "-r--r--r--",
// 		// The modification time of the entry (see below for definition)
// 		mtime: new Date(),
// 	}));

// 	const ipfsResults: AddResult[] = [];
// 	for await (const result of ipfs.addAll(filesData, { wrapWithDirectory: true })) ipfsResults.push(result);

// 	const ipfsDirectory: any = ipfsResults[ipfsResults.length - 1];
// 	ipfsDirectory.full_path = ipfsDirectory.cid.toString();
// 	const ipfsFiles = ipfsResults
// 		.slice(0, -1)
// 		.map((ipfsFile) => ({ ...ipfsFile, full_path: `${ipfsDirectory.full_path}/${ipfsFile.path}` }));

// 	return {
// 		directory: ipfsDirectory,
// 		files: ipfsFiles,
// 	};
// };

// const download = async (url: string): Promise<Buffer[]> => {
// 	const ipfs = store.getState().ipfsService!;
// 	const downloadResult: AsyncIterable<Uint8Array> = ipfs.cat(getIPFSPath(url));

// 	const response: Uint8Array[] = [];
// 	for await (const part of downloadResult) {
// 		response.push(part);
// 	}

// 	return response.map((item) => Buffer.from(item));
// };

// const IPFS = {
// 	getIPFSUrlFromPath,
// 	getIPFSPath,
// 	getIPFSClient,
// 	upload,
// 	uploadMany,
// 	download,
// };

// export default IPFS;

export default "TODO: Not implemented yet";
