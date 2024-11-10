import { safeFetch } from "./utils/safeFetch";
import { safeParse } from "./utils/safeParse";

import type { SafeFetchResponse } from "./utils/safeFetch";
import type { SafeParseResponse } from "./utils/safeParse";

const URL_TO_FETCH =
	"https://www.stubhub.com/martin-garrix-maharashtra-tickets-3-14-2025/event/156123945/?quantity=2";

const main = async (): Promise<void> => {
	const { html, fetchSucceeded }: SafeFetchResponse =
		await safeFetch(URL_TO_FETCH);
	if (!fetchSucceeded) return;

	const { $, parseSucceeded }: SafeParseResponse = safeParse(html);
	if (!parseSucceeded) return;

	// Display the title of the fetched page
	console.log($("title").text());
};

main().catch((error) => {
	console.error(`Error executing main: ${error}`);
	process.exit(1);
});
