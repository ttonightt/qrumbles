import { describe, expect, test } from "vitest";
import { choose } from "../src/libs/beans";


describe("choose", () => {

	test("12 [11,12,13] [10,20,30]", () => {

		expect( choose( 12, [11,12,13], [10,20,30] ) ).toBe(20);
	});

	test("34 [11,12,13] [10,20,30]", () => {

		expect( choose( 34, [11,12,13], [10,20,30] ) ).toBe(undefined);
	});
});