import * as cheerio from "cheerio";

export interface SafeParseResponse {
	$: cheerio.Root;
	parseSucceeded: boolean;
}

export const safeParse = (html: string): SafeParseResponse => {
	try {
		const $ = cheerio.load(html);

		return { $, parseSucceeded: true };
	} catch (error) {
		console.error(`Error parsing HTML: ${error}`);

		return { $: cheerio.load(""), parseSucceeded: false };
	}
};
