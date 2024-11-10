import type { TicketData } from "./TicketData";

export interface IndexData {
	items: TicketData[];
	totalFilteredListings: number;
	itemsRemaining: number;
}
