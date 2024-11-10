import { safeFetch } from "./utils/safeFetch";
import { safeParse } from "./utils/safeParse";
import { extractTicketData } from "./utils/extractTicketData";

import type { SafeFetchResponse } from "./interfaces/SafeFetchResponse";
import type { SafeParseResponse } from "./interfaces/SafeParseResponse";
import type { ExtractedTicketData } from "./interfaces/ExtractedTicketData";

const URL_TO_FETCH =
	"https://www.stubhub.com/martin-garrix-maharashtra-tickets-3-14-2025/event/156123945/?quantity=2";

const main = async (): Promise<void> => {
	const { html, fetchSucceeded }: SafeFetchResponse =
		await safeFetch(URL_TO_FETCH);
	if (!fetchSucceeded) return;

	const { $, parseSucceeded }: SafeParseResponse = safeParse(html);
	if (!parseSucceeded) return;

	const indexDataText = $("#index-data").text() ?? "";
	if (!indexDataText || indexDataText === "") {
		console.error("Index data not found in HTML");
		return;
	}

	const ticketDetails: ExtractedTicketData[] =
		await extractTicketData(indexDataText);
	if (!ticketDetails) return;

	console.log(`Found ${ticketDetails.length} available tickets`);
	console.log(ticketDetails);
};

main().catch((error) => {
	console.error(`Error executing main: ${error}`);
	process.exit(1);
});
