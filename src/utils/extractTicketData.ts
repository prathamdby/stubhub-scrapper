import type { TicketData } from "../interfaces/TicketData";
import type { ExtractedTicketData } from "../interfaces/ExtractedTicketData";

export const extractTicketData = async (
	ticketDetails: TicketData[],
): Promise<Array<ExtractedTicketData>> => {
	try {
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
