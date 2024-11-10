import axios from "axios";

import { AXIOS_REQUEST_TIMEOUT_MS, AXIOS_MAX_RETRIES } from "../config.json";

import type { SafeFetchResponse } from "../interfaces/SafeFetchResponse";
import type { TimeoutError } from "../interfaces/TimeoutError";

const TIMEOUT_MS = AXIOS_REQUEST_TIMEOUT_MS;
const MAX_RETRIES = AXIOS_MAX_RETRIES;

const REQUEST_PAYLOAD = {
	ShowAllTickets: true,
	HideDuplicateTicketsV2: false,
	Quantity: 2,
	IsInitialQuantityChange: false,
	PageVisitId: "",
	PageSize: 20,
	SortBy: "NEWPRICE",
	SortDirection: 0,
	Sections: "",
	Rows: "",
	Seats: "",
	SeatTypes: "",
	TicketClasses: "",
	ListingNotes: "",
	PriceRange: "0,100",
	InstantDelivery: false,
	EstimatedFees: false,
	PriceOption: "",
	HasFlexiblePricing: false,
	ExcludeSoldListings: false,
	RemoveObstructedView: false,
	NewListingsOnly: false,
	PriceDropListingsOnly: false,
	SelectBestListing: false,
	ConciergeTickets: false,
	Method: "IndexSh",
};

export const safeFetch = async (
	url: string,
	paginationIndex = 1,
	retries = 0,
): Promise<SafeFetchResponse> => {
	try {
		const { data } = await axios.post<string>(
			url,
			{
				...REQUEST_PAYLOAD,
				CurrentPage: paginationIndex,
				BetterValueTickets: url.includes("stubhub"),
			},
			{
				timeout: TIMEOUT_MS,
			},
		);

		return {
			data,
			fetchSucceeded: true,
		};
	} catch (error: unknown) {
		if (isTimeoutError(error) && retries < MAX_RETRIES) {
			console.error(
				`Request timed out. Retry attempt ${retries + 1}/${MAX_RETRIES}...`,
			);
			return safeFetch(url, retries + 1);
		}

		console.error(`Error fetching URL: ${error}`);

		return {
			data: "",
			fetchSucceeded: false,
		};
	}
};

function isTimeoutError(error: unknown): error is TimeoutError {
	return Boolean(
		error &&
			typeof error === "object" &&
			"code" in error &&
			(error as TimeoutError).code === "ECONNABORTED",
	);
}
