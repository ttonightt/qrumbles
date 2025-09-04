import { bench, describe } from "vitest";


describe("Array of nums VS Int8Array", () => {

	const len = 1000;

	bench("Array of nums", () => {
	
		const arr = [];

		for (let i = 0; i < len; i++) {

			arr[i] = i;
		}

	}, { time: 1000 });

	bench("Int8Array", () => {
	
		const arr = new Int8Array(len);

		for (let i = 0; i < len; i++) {

			arr[i] = i;
		}

	}, { time: 1000 });
});