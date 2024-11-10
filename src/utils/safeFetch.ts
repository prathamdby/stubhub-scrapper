import axios from "axios";
import { AXIOS_REQUEST_TIMEOUT_MS, AXIOS_MAX_RETRIES } from "../config.json";

const TIMEOUT_MS = AXIOS_REQUEST_TIMEOUT_MS; // 5 seconds
const MAX_RETRIES = AXIOS_MAX_RETRIES; // 3 retries
const USER_AGENTS = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
	"Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
	"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
	"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
]; // List of user agents to rotate

interface TimeoutError {
	code: string;
	message: string;
}

interface SafeFetchResponse {
	html: string;
	success: boolean;
}

export const safeFetch = async (
	url: string,
	retries = 0,
): Promise<SafeFetchResponse> => {
	try {
		const { data: html } = await axios.get<string>(url, {
			timeout: TIMEOUT_MS,
			headers: {
				"User-Agent": getRandomUserAgent(),
			},
		});

		return {
			html,
			success: true,
		};
	} catch (error: unknown) {
		if (isTimeoutError(error) && retries < MAX_RETRIES) {
			console.error(
				`Request timed out. Retry attempt ${retries + 1}/${MAX_RETRIES}...`,
			);
			return safeFetch(url, retries + 1);
		}

		return {
			html: "",
			success: false,
		};
	}
};

const getRandomUserAgent = (): string =>
	USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

function isTimeoutError(error: unknown): error is TimeoutError {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as TimeoutError).code === "ECONNABORTED"
	);
}
