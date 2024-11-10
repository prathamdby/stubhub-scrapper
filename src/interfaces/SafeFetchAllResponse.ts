import type { TicketData } from "./TicketData";

export interface SafeFetchAllResponse {
	data: TicketData[];
	fetchAllSucceeded: boolean;
}
