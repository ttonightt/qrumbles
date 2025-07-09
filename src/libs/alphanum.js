import { b, b8, binole } from "./beans";
import { Byte } from "./byte";

export class Alphanum extends Uint8Array {

	static getBitLength (strOarr16) {

	}

	static encode (str) {

		const arr16 = Int16Array(str.length);

		return arr16;
	}

	static fit (arr16) {

	}

	static fromString () {

	}

	static fromInt16Array () {
		
	}

	static prefix (len) {

		const arr8 = new Uint8Array(2);

		arr8[0] = 0b0010 << 4;
		arr8[0] = 0b0010 << 4;

		console.log(b8(arr8));
	};

	constructor (len) {

		
	}

	set11 () {

	}

	get11 () {

	}
}

Alphanum.prefix(22);

binole.log(0b1111111 % 8);