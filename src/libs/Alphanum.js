import { b, b8, binole } from "./beans";

import { BinaryAsArray } from "./BinaryAsArray";

export const Alphanum = {

	__ref: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:",
//			011111111111111111111111111111111111111111111
//			  0100110000111100000000111111110000000000000
//			    01010011001100001111000011110000000011111
//			        0101010100110011001100110000111100001
//			                01010101010101010011001100110
//			                                0101010101010

	charToCode (c) {

		return this.__ref.indexOf(c);
	},

	codeToChar (i) {

		if (!(0 <= i && i < 45)) throw new Error("...");

		return this.__ref[i];
	},

	prefix (version, len) {

		if (version < 1 || 40 < version) throw new Error("...");
		if (len < 1) throw new Error("...");

		const counterBitLength = 9 + Math.floor((version + 7) / 17) * 2;

		const bins = new BinaryAsArray(4 + counterBitLength);

		bins.type = "alphanumerical-prefix";
		bins.counterBitLength = counterBitLength;

		bins.setInt(0, 4, 0b0010);
		bins.setInt(4, counterBitLength, len);

		return bins;
	}
};

export class AlphanumArray extends BinaryAsArray {

	static bitLengthOf (len) {

		const lenM2 = len % 2;

		return (11 * (len - lenM2) / 2) + (6 * lenM2);
	}

	constructor (len) {

		super(AlphanumArray.bitLengthOf(len));

		this.type = "alphanumerical";
		this.length = len;
		this.base = 11;
		this.charbase = 2;

		this.lastBlockBase = len % 2 ? 6 : 11;
		this.lastBlockCharbase = len % 2 ? 1 : 2;
	}

	setStr (i, str) {

		if (!(0 <= i && i < this.length)) throw new Error("...");

		const len = i + str.length > this.length ? this.length - i : str.length;

		str = str.slice(0, len);

		let j = Math.floor(i / 2);
		const mj = Math.floor((i + len) / 2);

		let c = 0;

		if (i % 2) {

			const target = Math.floor(this.getInt(j * 11, 11) / 45) * 45;

			this.setInt(j * 11, 11, target + Alphanum.charToCode(str[c++]));

			j++;
		}

		for (j; j < mj; j++) {

			this.setInt(j * 11, 11, Alphanum.charToCode(str[c++]) * 45 + Alphanum.charToCode(str[c++]));
		}

		if ((i + len) % 2) {

			if (i + len === this.length) {

				this.setInt(mj * 11, 6, Alphanum.charToCode(str[c]));

			} else {

				const target = this.getInt(mj * 11, 11) % 45;

				this.setInt(mj * 11, 11, Alphanum.charToCode(str[c]) * 45 + target);
			}
		}

		return this;
	}

	getStr (i = 0, len) {

		if (!(0 <= i && i < this.length)) throw new Error("...");

		if (i + len > this.length || len === undefined) len = this.length - i;

		let str = "";

		let j = Math.floor(i / 2);
		const mj = Math.floor((i + len) / 2);

		if (i % 2) {

			const int = this.getInt(j * 11, 11) % 45;

			str += Alphanum.codeToChar(int);

			j++;
		}

		for (j; j < mj; j++) {

			const int = this.getInt(j * 11, 11);
			str += Alphanum.codeToChar(Math.floor(int / 45)) + Alphanum.codeToChar(int % 45);
		}

		if ((i + len) % 2) {

			str += Alphanum.codeToChar(
				i + len === this.length
				?
				this.getInt(mj * 11, 6)
				:
				Math.floor(this.getInt(mj * 11, 11) / 45)
			);
		}

		return str;
	}

	validate () {

		const mistakes = [];

		const len2 = Math.floor(this.length / 2);

		for (let i = 0; i < len2; i++) {

			const code = this.getInt(i * 11, 11);

			if (code >= 45 * 45) {

				mistakes.push({
					value: code,
					blockIndex: i,
					bitLength: 11
				});
			}
		}

		if (this.length % 2) {

			const code = this.getInt(this.bitLength - 6, 6);

			if (code >= 45) {

				mistakes.push({
					value: code,
					blockIndex: len2,
					bitLength: 6
				});
			}
		}

		return mistakes;
	}

	toUintArray () {

		const ints = new Uint16Array(Math.ceil(this.length / 2));

		const len2 = Math.floor(this.length / 2)

		for (let i = 0; i < len2; i++)

			ints[i] = this.getInt(i * 11, 11);

		if (this.length % 2)

			ints[len2] = this.getInt(len2 * 11, 6);

		return ints;
	}
}

// const arr = new AlphanumArray(9);

// arr.setStr(1, "ANASTASIA");

// console.log(b(arr.toUintArray(), 11));

// const message = arr.getStr();

// console.log(message);