import { describe, expect, test } from "vitest";
import { choose, chooseSlope } from "../src/libs/beans";


describe("choose", () => {

	test("12 [11,12,13] [10,20,30]", () => {

		expect( choose( 12, [11,12,13], [10,20,30] ) ).toBe(20);
	});

	test("34 [11,12,13] [10,20,30]", () => {

		expect( choose( 34, [11,12,13], [10,20,30] ) ).toBe(undefined);
	});
});

describe("chooseSlope", () => {

	describe("x [0,7,11,16] [1,2,3] true", () => {

		test("0-17", () => {

			expect( chooseSlope( 0, [0,7,11,16], [1,2,3], true ) ).toBe(undefined);

			for (let i = 1; i <= 16; i++) {

				if (i <= 7) {

					expect( chooseSlope( i, [0,7,11,16], [1,2,3], true ) ).toBe(1);
					continue;
				}

				if (i <= 11) {

					expect( chooseSlope( i, [0,7,11,16], [1,2,3], true ) ).toBe(2);
					continue;
				}

				if (i <= 16) {

					expect( chooseSlope( i, [0,7,11,16], [1,2,3], true ) ).toBe(3);
					continue;
				}
			}

			expect( chooseSlope( 17, [0,7,11,16], [1,2,3], true ) ).toBe(undefined);
		});
	});

	describe("x [1,10,27,41] [10,12,14]", () => {

		test("0-41", () => {

			expect( chooseSlope( 0, [1,10,27,41], [10,12,14] ) ).toBe(undefined);

			for (let i = 1; i < 41; i++) {

				if (i < 10) {

					expect( chooseSlope( i, [1,10,27,41], [10,12,14] ) ).toBe(10);
					continue;
				}

				if (i < 27) {

					expect( chooseSlope( i, [1,10,27,41], [10,12,14] ) ).toBe(12);
					continue;
				}

				if (i < 41) {

					expect( chooseSlope( i, [1,10,27,41], [10,12,14] ) ).toBe(14);
					continue;
				}
			}

			expect( chooseSlope( 41, [1,10,27,41], [10,12,14] ) ).toBe(undefined);
		});
	});
});