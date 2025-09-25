import { describe, expect, assert, test } from "vitest";
import { deepEqualIntArrays } from "./commons";

import { b8 } from "@ttonightt/beans";
import { ByteArray, UTF16ByteArray, UTF8 } from "../src/libs/Byte";


const getInit = () => {

	const arr1 = new ByteArray(6, "latin1");
	const arr2 = new ByteArray(5, "latin1");
	const arr3 = new UTF16ByteArray(8);
	const arr4 = new UTF16ByteArray(10);

	arr2.bytes = new Uint8Array([ 0x57, 0x77, 0xf8, 0xf0, 0xde ]);

	arr4.bytes = new Uint8Array([ 0x3, 0x95, 0x3, 0xbb, 0x3, 0xbb, 0x3, 0xaf, 0x3, 0xbd, 0x3, 0xb9, 0x3, 0xba, 0x3, 0xb1 ]);

	return [
		arr1,
		arr2,
		arr3,
		arr4
	];
};

describe("Encodings", () => {

	describe("UTF8", () => {

		describe("getByteLength", () => {

			test("\\x10", () => {

				expect( UTF8.getByteLength("\x10") ).toBe(1);
			});

			test("\\xff", () => {

				expect( UTF8.getByteLength("\xff") ).toBe(2);
			});

			test("\\uaeee", () => {

				expect( UTF8.getByteLength("\uaeee") ).toBe(3);
			});
		});

		test("\\x10", () => {

			deepEqualIntArrays(
				UTF8.charToCode("\x10"),
				[0b00010000]
			);
		});

		test("\\x10", () => {

			deepEqualIntArrays(
				UTF8.charToCode("\x10"),
				[0b00010000]
			);
		});

		test("\\xff", () => {

			deepEqualIntArrays(
				UTF8.charToCode("\xff"),
				[0b11000011, 0b10111111]
			);
		});

		test("\\uaeee", () => {

			deepEqualIntArrays(
				UTF8.charToCode("\uaeee"),
				[0b11101010, 0b10111011, 0b10101110]
			);
		});

		test("00010000", () => {

			const char = UTF8.codeToChar([0b00010000]);

			expect( char ).toBe("\x10");
		});

		test("0b11000011 0b10111111", () => {

			const char = UTF8.codeToChar([0b11000011, 0b10111111]);

			expect( char ).toBe("\xff");
		});

		test("0b11101010 0b10111011 0b10101110", () => {

			const char = UTF8.codeToChar([0b11101010, 0b10111011, 0b10101110]);

			expect( char ).toBe("\uaeee");
		});
	});

	describe("ByteArray", () => {

		describe("setStr", () => {

			const arr = getInit()[0];

			test("setStr", () => {

				arr.setStr(1, "a");

				deepEqualIntArrays(
					arr.bytes,
					[0, 0x61, 0, 0, 0, 0]
				);
			});

			test("setStr", () => {

				arr.setStr(0, "Wwøð?Þ");

				deepEqualIntArrays(
					arr.bytes,
					[0x57, 0x77, 0xf8, 0xf0, 0x3f, 0xde]
				);
			});
		});

		describe("getStr", () => {

			const arr = getInit()[1];

			test("arr2 1 2", () => {

				expect( arr.getStr(1, 2) ).toBe("wø");
			});

			test("arr2 0 5", () => {

				expect( arr.getStr(0, 5) ).toBe("WwøðÞ");
			});
		});
	});

	describe("UTF16ByteArray", () => {

		describe("setStr", () => {

			const arr = getInit()[2];

			test("arr3 3 ΨΩ", () => {

				arr.setStr(3, "ΨΩ");

				deepEqualIntArrays(
					arr.bytes,
					[
						0, 0,
						0, 0,
						0, 0,
						0x3, 0xa8,
						0x3, 0xa9,
						0, 0,
						0, 0,
						0, 0
					]
				);
			});

			test("arr3 0 Ελλίνικα", () => {

				arr.setStr(0, "Ελλίνικα");

				deepEqualIntArrays(
					arr.bytes,
					[
						0x3, 0x95,
						0x3, 0xbb,
						0x3, 0xbb,
						0x3, 0xaf,
						0x3, 0xbd,
						0x3, 0xb9,
						0x3, 0xba,
						0x3, 0xb1
					]
				);
			});
		});

		describe("getStr", () => {

			const arr = getInit()[3];

			test("arr4 1 2", () => {

				expect( arr.getStr(1, 2) ).toBe("λλ");
			});

			test("arr4 0 8", () => {

				expect( arr.getStr(0, 8) ).toBe("Ελλίνικα");
			});
		});
	});
});