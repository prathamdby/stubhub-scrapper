import type { IndexData } from "../interfaces/IndexData";

export const parseIndexData = (indexData: string): IndexData => {
	const parsedData = JSON.parse(JSON.stringify(indexData));

	if (!isValidIndexData(parsedData)) throw new Error("Invalid index data");

	return parsedData as IndexData;
};

function isValidIndexData(indexData: unknown): indexData is IndexData {
	return Boolean(
		indexData &&
			typeof indexData === "object" &&
			"items" in indexData &&
			Array.isArray(indexData.items),
	);
}
