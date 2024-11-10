import readline from "node:readline";

import { safeFetch } from "./utils/safeFetch";
import { safeParse } from "./utils/safeParse";
import { extractTicketData } from "./utils/extractTicketData";

import type { SafeFetchResponse } from "./interfaces/SafeFetchResponse";
import type { SafeParseResponse } from "./interfaces/SafeParseResponse";
import type { ExtractedTicketData } from "./interfaces/ExtractedTicketData";

const STUBHUB_EVENT_URL =
	"https://www.stubhub.com/martin-garrix-maharashtra-tickets-3-14-2025/event/156123945/?quantity=2";

const main = async (): Promise<void> => {
	const { html, fetchSucceeded }: SafeFetchResponse =
		await safeFetch(STUBHUB_EVENT_URL);
	if (!fetchSucceeded) return;

	const { $, parseSucceeded }: SafeParseResponse = safeParse(html);
	if (!parseSucceeded) return;

	const indexDataText = $("#index-data").text().trim();

	const ticketDetails: ExtractedTicketData[] =
		await extractTicketData(indexDataText);
	if (!ticketDetails || ticketDetails.length < 1) return;

	console.log(`Found ${ticketDetails.length} available tickets`);
	const sections = [...new Set(ticketDetails.map((ticket) => ticket.section))];
	console.log(`Sections found:\n${sections.join("\n")}\n`);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question("Enter the section you want to explore: ", (section) => {
		const selectedTickets = ticketDetails.filter((ticket) =>
			ticket.section.toLowerCase().includes(section.toLowerCase()),
		);

		if (selectedTickets.length < 1) {
			console.log("No tickets found for the specified section");
			rl.close();
			return;
		}

		console.log(
			`Found ${selectedTickets.length} tickets for section ${section}`,
		);
		console.log(selectedTickets);

		rl.close();
	});
};

main().catch((error) => {
	console.error(`Error executing main: ${error}`);
	process.exit(1);
});
