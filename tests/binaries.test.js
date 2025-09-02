import { describe, expect, assert, test } from "vitest";

import { BinaryAsArray } from "../src/libs/BinaryAsArray";
import { b8, b } from "../src/libs/beans";

const deepEqualIntArrays = (opt1, opt2) => {

	console.log( b8(opt1) );
	console.log( b8(opt2) );

	return assert.deepEqual( Array.from(opt1), Array.from(opt2) );
};

const getInit = () => {

	const arr1 = new BinaryAsArray(35);
	const arr2 = new BinaryAsArray(15);

	arr1.bytes = new Uint8Array([ 0b10101010, 0b00110101, 0b11001100, 0b01010101, 0b00100000 ]);
	arr2.bytes = new Uint8Array([ 0b11110000, 0b01011010 ]);

	return [
		arr1,
		arr2
	];
};

describe("beans", () => {

	test("b", () => {

		const data = [
			123,
			[ 321 ],
			new Uint8Array([ 255, 11, 3 ])
		];

		console.log( b(data, 8) );
	});
});

describe("BinaryAsArray", () => {
	
	describe("putBitArray", () => {

		test("arr1 0", () => {

			const arrs = getInit();

			deepEqualIntArrays(
				arrs[0].putBitArray(arrs[1], 0).bytes,
				[0b11110000, 0b01011011, 0b11001100, 0b01010101, 0b00100000]
			);
		});

		test("arr1 2", () => {

			const arrs = getInit();

			deepEqualIntArrays(
				arrs[0].putBitArray(arrs[1], 2).bytes,
				[0b10111100, 0b00010110, 0b11001100, 0b01010101, 0b00100000]
			);
		});

		test("arr1 30", () => {

			const arrs = getInit();

			deepEqualIntArrays(
				arrs[0].putBitArray(arrs[1], 30).bytes,
				[0b10101010, 0b00110101, 0b11001100, 0b01010111, 0b11000000]
			);
		});

		test("arr1 20 13", () => {

			const arrs = getInit();

			deepEqualIntArrays(
				arrs[0].putBitArray(arrs[1], 20, 13).bytes,
				[0b10101010, 0b00110101, 0b11001111, 0b00000101, 0b10100000]
			);
		});

		test("arr1 20 13 9", () => {

			const arrs = getInit();

			deepEqualIntArrays(
				arrs[0].putBitArray(arrs[1], 20, 13, 9).bytes,
				[0b10101010, 0b00110101, 0b11001011, 0b01010101, 0b00100000]
			);
		});

		test("arr2 5 8 9", () => {

			const arrs = getInit();

			deepEqualIntArrays(
				arrs[1].putBitArray(arrs[0], 5, 8, 9).bytes,
				[0b11110011, 0b01011010]
			);
		});
	});

	describe("cutBitArray works", () => {

		test("arr1", () => {

			const arr = getInit()[0];

			deepEqualIntArrays(
				arr.cutBitArray(13).bytes,
				[0b10111001, 0b10001010, 0b10100100]
			);
		});

		test("arr1 5 8", () => {

			const arr = getInit()[0];

			deepEqualIntArrays(
				arr.cutBitArray(5, 8).bytes,
				[0b01000110]
			);
		});
	});
});