import { assert, describe, expect, test } from "vitest";
import { choose, chooseSlope, isIterable, minmax, rand, randFrom } from "../src/libs/beans";


describe("isIterable", () => {

	test("string", () => {

		expect( isIterable("") ).toBeTruthy();
	});

	test("String.prototype", () => {

		expect( isIterable(String) ).toBeFalsy();
	});
});

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

describe("minmax", () => {

	test("11 12 13 14 15 16", () => {

		assert.deepEqual( minmax( 14, 12, 13, 11, 15, 16 ), [11, 16] );
	});
});

describe("rand", () => {

	test("()", () => {

		for (let i = 0; i < 10000; i++) {

			const x = rand();

			expect( x ).toBeGreaterThanOrEqual(0);
			expect( x ).toBeLessThanOrEqual(1);
		}
	});

	test("4", () => {

		for (let i = 0; i < 10000; i++) {

			const x = rand(0, 4);

			expect( x ).toBeGreaterThanOrEqual(0);
			expect( x ).toBeLessThanOrEqual(4);
		}
	});

	test("3 8", () => {

		for (let i = 0; i < 10000; i++) {

			const x = rand(3, 8);

			expect( x ).toBeGreaterThanOrEqual(3);
			expect( x ).toBeLessThanOrEqual(8);
		}
	});
});

describe("randFrom", () => {

	const arr = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
	const str = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";

	test("arr", () => {

		const check = [];

		for (let i = 0; i < 1000; i++) {

			const x = randFrom(arr);

			check.includes(x) || check.push(x);
		}

		for (const item of check) {

			expect( arr ).include(item);
		}
	});

	test("arr 7", () => {

		const check = [];

		for (let i = 0; i < 1000; i++) {

			const x = randFrom(arr, 7);

			check.includes(x) || check.push(x);
		}

		for (const item of check) {

			expect( arr.slice(0, 7) ).include(item);
		}
	});

	test("arr 3 8", () => {

		const check = [];

		for (let i = 0; i < 1000; i++) {

			const x = randFrom(arr, 3, 8);

			check.includes(x) || check.push(x);
		}

		for (const item of check) {

			expect( arr.slice(3, 8) ).include(item);
		}
	});

	test("str", () => {

		const check = [];

		for (let i = 0; i < 1000; i++) {

			const x = randFrom(str);

			check.includes(x) || check.push(x);
		}

		for (const item of check) {

			expect( str ).include(item);
		}
	});

	test("str 7", () => {

		const check = [];

		for (let i = 0; i < 1000; i++) {

			const x = randFrom(str, 7);

			check.includes(x) || check.push(x);
		}

		for (const item of check) {

			expect( str.slice(0, 7) ).include(item);
		}
	});

	test("str 3 8", () => {

		const check = [];

		for (let i = 0; i < 1000; i++) {

			const x = randFrom(str, 3, 8);

			check.includes(x) || check.push(x);
		}

		for (const item of check) {

			expect( str.slice(3, 8) ).include(item);
		}
	});
});