import axiosClient from "../configs/server.config";

export type EnvironmentKey =
	| "TEXT_RAZOR_API_ENDPOINT"
	| "TEXT_RAZOR_API_KEY"
	| "G2P_API_ENDPOINT"
	| "G2P_IMAGE_ENDPOINT"
	| "FIREBASE_API_KEY"
	| "FIREBASE_AUTH_DOMAIN"
	| "FIREBASE_PROJECT_ID"
	| "FIREBASE_STORAGE_BUCKET"
	| "FIREBASE_MESSAGING_SENDER_ID"
	| "FIREBASE_APP_ID"
	| "FIREBASE_MEASUREMENT_ID";

export const getEnvironment = async (): Promise<Record<EnvironmentKey, string>> =>
	axiosClient.get<Record<EnvironmentKey, string>, Record<EnvironmentKey, string>>("environment");
