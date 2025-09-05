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

describe.only("push + flat VS concat + flat VS push ... VS concat ...", () => {

	const arr1 = new Array(1000).map( (v, i) => i );
	const arr2 = new Array(100).map( () => 
		new Array(
			Math.round( Math.random() * 2 ) + 1
		)
		.map( (v, i) => i ) );

	bench("push + flat", () => {
	
		for ( const item in arr2 )

			arr1.push(item);

		arr1.flat(1);

	}, { time: 1000 });

	bench("concat", () => {

		arr1.concat(arr2);
		arr1.flat(1);

	}, { time: 1000 });

	bench("push ...", () => {
	
		for ( const item in arr2 )

			arr1.push(...item);

	}, { time: 1000 });

	bench("concat ...", () => {

		arr1.concat(...arr2);

	}, { time: 1000 });
});