import type { TicketData } from "./TicketData";

export interface IndexData {
	items: TicketData[];
	pageSize: number;
	totalFilteredListings: number;
	itemsRemaining: number;
}
