import * as cheerio from "cheerio";

import type { SafeParseResponse } from "../interfaces/SafeParseResponse";

export const safeParse = (html: string): SafeParseResponse => {
	try {
		const $ = cheerio.load(html);

		return { $, parseSucceeded: true };
	} catch (error) {
		console.error(`Error parsing HTML: ${error}`);

		return { $: cheerio.load(""), parseSucceeded: false };
	}
};
