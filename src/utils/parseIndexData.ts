import type { IndexData } from "../interfaces/IndexData";

export const parseIndexData = (indexData: string): IndexData => {
	const parsedData = JSON.parse(JSON.stringify(indexData));

	if (!isValidIndexData(parsedData)) throw new Error("Invalid index data");

	return parsedData as IndexData;
};

function isValidIndexData(indexData: object): boolean {
	return Boolean("items" in (indexData as IndexData));
}
