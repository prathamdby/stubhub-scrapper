import { safeFetch } from "./safeFetch";
import { parseIndexData } from "./parseIndexData";

import type { TicketData } from "../interfaces/TicketData";
import type { SafeFetchAllResponse } from "../interfaces/SafeFetchAllResponse";
import type { SafeFetchResponse } from "../interfaces/SafeFetchResponse";

export const safeFetchAll = async (
	url: string,
): Promise<SafeFetchAllResponse> => {
	try {
		const allItems: TicketData[] = [];

		// Initial request to fetch the parameters
		const { data, fetchSucceeded }: SafeFetchResponse = await safeFetch(url);
		if (!fetchSucceeded)
			return {
				data: [],
				fetchAllSucceeded: false,
			};

		const parsedIndexData = parseIndexData(data);

		allItems.push(...parsedIndexData.items);

		// Calculate the total number of pages to fetch
		const totalPages = Math.ceil(
			parsedIndexData.totalFilteredListings / parsedIndexData.pageSize,
		);

		console.log(`Total pages to fetch: ${totalPages}`);

		// Fetch the remaining pages
		// Start from 2 since we already fetched the first page
		// i + 2 because when i = 0 we want to fetch page 2
		// and when i = 1 we want to fetch page 3 and so on
		const requests = Array.from({ length: totalPages - 1 }, (_, i) =>
			safeFetch(url, i + 2).then(
				({ data, fetchSucceeded }) =>
					fetchSucceeded && allItems.push(...parseIndexData(data).items),
			),
		);

		await Promise.all(requests);

		return {
			data: allItems,
			fetchAllSucceeded: true,
		};
	} catch (error: unknown) {
		console.error(`Error fetching all data: ${error}`);

		return {
			data: [],
			fetchAllSucceeded: false,
		};
	}
};
