import { describe, expect, assert, test } from "vitest";
import { deepEqualIntArrays } from "./commons";
import { Alphanum, AlphanumArray } from "../src/libs/Alphanum";


const getInit = () => {

	const arr1 = new AlphanumArray(7);
	const arr2 = new AlphanumArray(7);
	const arr3 = new AlphanumArray(7);

	arr2.bytes = new Uint8Array([ 0b10110110, 0b00101010, 0b00101101, 0b11100100, 0b10011010 ]);
	arr3.bytes = new Uint8Array([ 0b10000000, 0b00010000, 0b00000011, 0b11111111, 0b11111111 ]);

	return [
		arr1,
		arr2,
		arr3
	];
};

describe("Alphanum", () => {

	test("lengths", () => {

		const arr = getInit()[0];

		expect( arr.bitLength ).toBe(39);
		expect( arr.bytes.length ).toBe(5);
		expect( arr.length ).toBe(7);
	});

	describe("prefix", () => {

		test("23 255", () => {

			const prefix = Alphanum.prefix(23, 255);

			expect(prefix.bitLength).toBe(15);

			deepEqualIntArrays(
				prefix.bytes,
				[0b00100001, 0b11111110]
			);
		});
	});

	describe("setStr", () => {

		const arr = getInit()[0];

		test("arr1 1 A", () => {

			arr.setStr(1, "A");

			deepEqualIntArrays(
				arr.bytes,
				[0b00000001, 0b01000000, 0, 0, 0]
			);
		});

		test("arr1 0 WWWORLD", () => {

			arr.setStr(0, "WWWORLD");

			deepEqualIntArrays(
				arr.bytes,
				[0b10111000, 0b00010110, 0b11100010, 0b01101010, 0b00011010]
			);
		});

		test("arr1 1 HELLO", () => {

			arr.setStr(1, "HELLO");

			deepEqualIntArrays(
				arr.bytes,
				[0b10110110, 0b00101010, 0b00101101, 0b11100100, 0b10011010]
			);
		});
	});

	describe("getStr", () => {

		const arr = getInit()[1];

		test("arr1 0 2", () => {

			expect( arr.getStr(0, 2) ).toBe("WH");
		});

		test("arr1 2, 2", () => {

			expect( arr.getStr(2, 2) ).toBe("EL");
		});

		test("arr1 4 7", () => {

			expect( arr.getStr(4, 7) ).toBe("LOD");
		});
	});

	describe("validate", () => {

		test("arr1 0 2", () => {

			const arr = getInit()[2];

			const mistakes = arr.validate();

			console.log(mistakes);

			expect( mistakes.length ).toBe(2);
		});
	});
});