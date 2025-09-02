import { describe, expect, assert, test } from "vitest";
import { deepEqualIntArrays } from "./commons";

import { b8 } from "../src/libs/beans";
import { UTF8 } from "../src/libs/Byte";

describe("Encodings", () => {

	describe("UTF8", () => {

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
});