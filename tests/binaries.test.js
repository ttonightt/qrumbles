import { describe, expect, assert, test } from "vitest";
import { deepEqualIntArrays } from "./commons";

import { BinaryAsArray } from "../src/libs/BinaryAsArray";
import { b8, b } from "../src/libs/beans";

const getInit = () => {

	const arr1 = new BinaryAsArray(35);
	const arr2 = new BinaryAsArray(15);
	const arr3 = new BinaryAsArray(7);
	const arr4 = new BinaryAsArray(4);

	arr1.bytes = new Uint8Array([ 0b10101010, 0b00110101, 0b11001100, 0b01010101, 0b00100000 ]);
	arr2.bytes = new Uint8Array([ 0b11110000, 0b01011010 ]);
	arr3.bytes = new Uint8Array([ 0b01101010 ]);
	arr4.bytes = new Uint8Array([ 0b10010000 ]);

	return [
		arr1,
		arr2,
		arr3,
		arr4
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

	describe("cutBitArray", () => {

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

	describe("assignInt", () => {

		test("arr1 255 0 8", () => {

			const arr = getInit()[0];

			deepEqualIntArrays(
				arr.assignInt(255, 0, 8).bytes,
				[0b11111111, 0b00110101, 0b11001100, 0b01010101, 0b00100000]
			);
		});

		test("arr1 101110111 13 12", () => {

			const arr = getInit()[0];

			deepEqualIntArrays(
				arr.assignInt(0b000101110111, 13, 12).bytes,
				[0b10101010, 0b00110000, 0b10111011, 0b11010101, 0b00100000]
			);
		});

		test("arr1 101110111 13 4", () => {

			const arr = getInit()[0];

			deepEqualIntArrays(
				arr.assignInt(0b000101110111, 13, 4).bytes,
				[0b10101010, 0b00110011, 0b11001100, 0b01010101, 0b00100000]
			);
		});
	});

	describe("getInt", () => {

		test("arr1 0 20", () => {

			const arr = getInit()[0];

			expect( arr.getInt(0, 20) ).toBe(0b10101010001101011100);
		});

		test("arr1 13 20", () => {

			const arr = getInit()[0];

			expect( arr.getInt(13, 20) ).toBe(0b10111001100010101010);
		});
	});

	describe("static join", () => {

		test("all init", () => {

			const arrs = getInit();

			deepEqualIntArrays(
				BinaryAsArray.join(...arrs).bytes,
				[0b10101010, 0b00110101, 0b11001100, 0b01010101, 0b00111110, 0b00001011, 0b01011010, 0b11001000]
			);
		});
	});

	describe("static from", () => {

		test("arr1.bytes", () => {

			const arr = getInit()[0];

			const res = BinaryAsArray.from( arr.bytes );

			expect( res.bitLength ).toBe(40);

			deepEqualIntArrays(
				res.bytes,
				arr.bytes
			);
		});

		test("arr1", () => {

			const arr = getInit()[0];

			const res = BinaryAsArray.from( arr );

			expect( res.bitLength ).toBe(35);

			deepEqualIntArrays(
				res.bytes,
				arr.bytes
			);
		});

		test("arr1.bytes 17", () => {

			const arr = getInit()[0];

			const res = BinaryAsArray.from( arr.bytes, 17 );

			expect( res.bitLength ).toBe(17);

			deepEqualIntArrays(
				res.bytes,
				[0b10101010, 0b00110101, 0b10000000]
			);
		});

		test("arr1 21", () => {

			const arr = getInit()[0];

			const res = BinaryAsArray.from( arr, 21 );

			expect( res.bitLength ).toBe(21);

			deepEqualIntArrays(
				res.bytes,
				[0b10101010, 0b00110101, 0b11001000]
			);
		});

		test("arr1.bytes 50", () => {

			const arr = getInit()[0];

			const res = BinaryAsArray.from( arr.bytes, 50 );

			expect( res.bitLength ).toBe(50);

			deepEqualIntArrays(
				res.bytes,
				[0b10101010, 0b00110101, 0b11001100, 0b01010101, 0b00100000, 0, 0]
			);
		});

		test("arr1 50", () => {

			const arr = getInit()[0];

			const res = BinaryAsArray.from( arr, 50 );

			expect( res.bitLength ).toBe(50);

			deepEqualIntArrays(
				res.bytes,
				[0b10101010, 0b00110101, 0b11001100, 0b01010101, 0b00100000, 0, 0]
			);
		});
	});
});