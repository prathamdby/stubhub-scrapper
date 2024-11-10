import axios from "axios";
import { AXIOS_REQUEST_TIMEOUT_MS, AXIOS_MAX_RETRIES } from "../config.json";

const TIMEOUT_MS = AXIOS_REQUEST_TIMEOUT_MS;
const MAX_RETRIES = AXIOS_MAX_RETRIES;

interface TimeoutError {
	code: string;
	message: string;
}

interface SafeFetchResponse {
	html: string;
	fetchSucceeded: boolean;
}

export const safeFetch = async (
	url: string,
	retries = 0,
): Promise<SafeFetchResponse> => {
	try {
		const { data: html } = await axios.get<string>(url, {
			timeout: TIMEOUT_MS,
		});

		return {
			html,
			fetchSucceeded: true,
		};
	} catch (error: unknown) {
		if (isTimeoutError(error) && retries < MAX_RETRIES) {
			console.error(
				`Request timed out. Retry attempt ${retries + 1}/${MAX_RETRIES}...`,
			);
			return safeFetch(url, retries + 1);
		}

		console.error(`Error fetching URL: ${error}`);

		return {
			html: "",
			fetchSucceeded: false,
		};
	}
};

function isTimeoutError(error: unknown): error is TimeoutError {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as TimeoutError).code === "ECONNABORTED"
	);
}
