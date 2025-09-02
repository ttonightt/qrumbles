import { assert } from "vitest";
import { b8 } from "../src/libs/beans";

export const deepEqualIntArrays = (opt1, opt2) => {

	console.log( b8(opt1) );
	console.log( b8(opt2) );

	return assert.deepEqual( Array.from(opt1), Array.from(opt2) );
};