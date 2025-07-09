import { b, b8, binole, clearLastBits } from "./beans";

export class Byte extends Uint8Array {

	static encode (str) {

		const arr8 = Int8Array(str.length);

		return arr16;
	}

	static fromString () {

	}

	static fromInt8Array () {
		
	}

	static prefix (len) {

		const arr8 = new Uint8Array(2);

		arr8[0] = 0b0100 << 4;
		arr8[0] = 0b0100 << 4;
	};

	constructor (len) {

		
	}

	put (bitOffset, bitLength, num) {

		const bitStart = bitOffset % 8;
		const byteStart = Math.floor(bitOffset / 8);

		const bitEnd = (bitOffset + bitLength) % 8;
		const byteEnd = Math.floor((bitOffset + bitLength) / 8);

		this[byteStart] = clearLastBits(this[byteStart], 8 - bitStart) + (num >> bitLength - 8 + bitStart);

		num % (1 << bitEnd);
	}
}