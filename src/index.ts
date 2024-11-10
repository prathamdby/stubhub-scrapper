import readline from "node:readline";

import { safeFetchAll } from "./utils/safeFetch";
import { extractTicketData } from "./utils/extractTicketData";

import type { ExtractedTicketData } from "./interfaces/ExtractedTicketData";
import type { SafeFetchAllResponse } from "./interfaces/SafeFetchAllResponse";

const STUBHUB_EVENT_URL =
	// "https://www.stubhub.com/martin-garrix-maharashtra-tickets-3-14-2025/event/156123945/";
	// "https://www.stubhub.com/coldplay-auckland-tickets-11-13-2024/event/152622548/";
	"https://www.stubhub.com/ap-dhillon-mumbai-tickets-12-7-2024/event/155505255/";

const main = async (): Promise<void> => {
	const { data, fetchAllSucceeded }: SafeFetchAllResponse =
		await safeFetchAll(STUBHUB_EVENT_URL);
	if (!fetchAllSucceeded) return;

	const ticketDetails: ExtractedTicketData[] = await extractTicketData(data);
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
