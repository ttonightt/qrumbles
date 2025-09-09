import { choose, splitByBase } from "./beans";

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

		const code = this.__ref.indexOf(c);

		if (code < 0)

			throw `Alphanum doesn't support this character: ${c}`;

		return code;
	},

	codeToChar (i) {

		if (!(0 <= i && i < 45)) throw new Error("...");

		return this.__ref[i];
	},

	prefix (version, len) {

		if (version < 1 || 40 < version) throw `version is out of range (must be > 1 and < 40)`;
		if (len < 1) throw `len argument is out of range (must be > 0)`;

		const counterBitLength = choose( true, [ version < 10, version < 27, true ], [ 9, 11, 13 ] );

		const bin = new BinaryAsArray(4 + counterBitLength);

		bin.type = "alphanumerical-prefix";
		bin.counterBitLength = counterBitLength;

		bin.setInt(0b0010, 0, 4);
		bin.setInt(len, 4, counterBitLength);

		return bin;
	}
};

export class AlphanumArray extends BinaryAsArray {

	static bitLengthOf (len) {

		const lenM2 = len % 2;

		return (11 * (len - lenM2) / 2) + (6 * lenM2);
	}

	static charsFitInto (bitLength) {

		const [pairs, mod] = splitByBase(bitLength, 11);

		return [
			( pairs * 2 ) + ( mod >= 6 ),
			mod % 6
		];
	}

	static fromString (str) {

		return new AlphanumArray(str.length).setStr(str);
	}

	static fromBinary (source) {

		const target = new AlphanumArray( this.charsFitInto( source.bitLength )[0] );

		BinaryAsArray.transferBits(target, source, 0);

		return target;
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

		if (!(0 <= i && i < this.length)) throw `i argument (index offset) is out of range (must be >= 0 and < array length)`;

		const len = i + str.length > this.length ? this.length - i : str.length;

		str = str.slice(0, len);

		let j = Math.floor(i / 2);
		const mj = Math.floor((i + len) / 2);

		let c = 0;

		if (i % 2) {

			const target = Math.floor(this.getInt(j * 11, 11) / 45) * 45;

			this.setInt(target + Alphanum.charToCode(str[c++]), j * 11, 11);

			j++;
		}

		for (j; j < mj; j++) {

			this.setInt(Alphanum.charToCode(str[c++]) * 45 + Alphanum.charToCode(str[c++]), j * 11, 11);
		}

		if ((i + len) % 2) {

			if (i + len === this.length) {

				this.setInt(Alphanum.charToCode(str[c]), mj * 11, 6);

			} else {

				const target = this.getInt(mj * 11, 11) % 45;

				this.setInt(Alphanum.charToCode(str[c]) * 45 + target, mj * 11, 11);
			}
		}

		return this;
	}

	getStr (i = 0, len = this.length) {

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

	slice (ff, ffe) {

		const target = new AlphanumArray(ffe - ff);

		const str = this.getStr(ff, ffe - ff);

		target.setStr(0, str);

		return target;
	}

	padStart (pad) {

		const target = new AlphanumArray( this.length + pad );

		const str = this.getStr(0, this.length);

		target.setStr(pad, str);

		return target;
	}

	padEnd (pad) {

		const target = new AlphanumArray( this.length + pad );

		const str = this.getStr(0, this.length);

		target.setStr(0, str);

		return target;
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