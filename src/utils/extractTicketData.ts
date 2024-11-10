import type { IndexData } from "../interfaces/IndexData";
import type { TicketData } from "../interfaces/TicketData";
import type { ExtractedTicketData } from "../interfaces/ExtractedTicketData";

export const extractTicketData = async (
	rawIndexData: string,
): Promise<Array<ExtractedTicketData>> => {
	try {
		const parsedIndexData = JSON.parse(rawIndexData);

		if (!isValidIndexData(parsedIndexData))
			throw new Error("Invalid index data");

		const ticketDetails: TicketData[] = (parsedIndexData as IndexData).grid
			.items;

		// Filter out any unavailable tickets
		const filteredTickets = ticketDetails.filter(
			(ticket) => ticket.availableQuantities.length > 0 && ticket.id > 0,
		);

		const finalTickets: ExtractedTicketData[] = [];

		for (const ticket of filteredTickets) {
			finalTickets.push({
				id: ticket.id,
				section: ticket.section,
				row: ticket.row && ticket.row !== "" ? ticket.row : "N/A",
				price: ticket.price,
				priceWithFees: ticket.priceWithFees,
				totalAvailableTickets: ticket.availableTickets,
			});
		}

		return finalTickets;
	} catch (error) {
		console.error(`Error parsing index data: ${error}`);

		return [];
	}
};

function isValidIndexData(indexData: object): boolean {
	return Boolean(
		"grid" in indexData && "items" in (indexData as IndexData).grid,
	);
}
