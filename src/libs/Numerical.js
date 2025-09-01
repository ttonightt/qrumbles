import { b, b8, binole, destructByBase } from "./beans";

import { BinaryAsArray } from "./BinaryAsArray";

export const Numerical = {

	prefix (version, len) {

		if (version < 1 || 40 < version) throw new Error("...");
		if (len < 1) throw new Error("...");

		const counterBitLength = 10 + Math.floor((version + 7) / 17) * 2;

		const bins = new BinaryAsArray(4 + counterBitLength);

		bins.type = "numerical-prefix";
		bins.counterBitLength = counterBitLength;

		bins.putInt(0, 4, 0b0001);
		bins.putInt(4, counterBitLength, len);

		return bins;
	}
};

// const mod = 1;

// console.log(destructByBase(329, 10 ** mod)[0]);

export class NumericalArray extends BinaryAsArray {

	static bitLengthOf (len) {

		const lenM3 = len % 3;

		const l = 10 * (len - lenM3) / 3;

		switch (len % 3) {
			case 0:
				return l;
			case 1:
				return l + 4;
			case 2:
				return l + 7;
		}
	}

	static encode (str) {
	}

	static decode (int16) {
	}

	constructor (len) {

		super(NumericalArray.bitLengthOf(len));

		this.type = "numerical";
		this.length = len;
		this.base = 10;
		this.charbase = 3;

		switch (len % 3) {
			case 0:
				this.lastBlockBase = 10;
				this.lastBlockCharbase = 3;
				break;
			case 1:
				this.lastBlockBase = 4;
				this.lastBlockCharbase = 1;
				break;
			case 2:
				this.lastBlockBase = 7;
				this.lastBlockCharbase = 2;
		}
	}

	setStr (i, str) {

		if (!(0 <= i && i < this.length)) throw new Error("...");

		const len = i + str.length > this.length ? this.length - i : str.length;

		str = str.slice(0, len);

		const mi = i + len;

		let j = Math.floor(i / 3);
		const mj = Math.floor(mi / 3);

		let c = 0;

		if (i % 3) {

			const ri = 3 - (i % 3);

			const target = destructByBase(

				this.cutInt(j * 10, 10),
				10 ** ri

			)[0];

			this.putInt(j * 10, 10, target + parseInt(str.slice(0, ri), 10));

			c += ri;
			j++;
		}

		for (j; j < mj; j++) {

			this.putInt(j * 10, 10, parseInt(str[c++] + str[c++] + str[c++], 10));
		}

		//
		switch ((mi % 3) * 10 + (mi === this.length ? this.lastBlockCharbase : this.charbase)) {
			case 13:
				this.putInt(mj * 10, 10,
					parseInt(str.slice(-1), 10) * 100
					+
					destructByBase(this.cutInt(mj * 10, 10), 100)[1]
				);
				break;
			case 23:
				this.putInt(mj * 10, 10,
					parseInt(str.slice(-2), 10) * 10
					+
					destructByBase(this.cutInt(mj * 10, 10), 10)[1]
				);
				break;
			case 22:
				this.putInt(mj * 10, 7,
					parseInt(str.slice(-2), 10)
				);
				break;
			case 12:
				this.putInt(mj * 10, 7,
					parseInt(str.slice(-1), 10) * 10
					+
					destructByBase(this.cutInt(mj * 10, 7), 10)[1]
				);
				break;
			case 11:
				this.putInt(mj * 10, 4,
					parseInt(str.slice(-1), 10)
				);
		}

		return this;
	}

	getStr (i, len) {

		if (!(0 <= i && i < this.length)) throw new Error("...");

		if (i + len > this.length) len = this.length - i;

		let str = "";

		let j = Math.floor(i / 2);
		const mj = Math.floor((i + len) / 2);

		if (i % 2) {

			const int = this.cutInt(j * 11, 11) % 45;

			str += Alphanum.codeToChar(int);

			j++;
		}

		for (j; j < mj; j++) {

			const int = this.cutInt(j * 11, 11);
			str += Alphanum.codeToChar(Math.floor(int / 45)) + Alphanum.codeToChar(int % 45);
		}

		if ((i + len) % 2) {

			str += Alphanum.codeToChar(
				i + len === this.length
				?
				this.cutInt(mj * 11, 6)
				:
				Math.floor(this.cutInt(mj * 11, 11) / 45)
			);
		}

		return str;
	}

	validate () {

		const mistakes = [];

		const len3 = Math.floor(this.length / 3);

		for (let i = 0; i < len3; i++) {

			const code = this.cutInt(i * 10, 10);

			if (code > 999) {

				mistakes.push({
					value: code,
					blockIndex: i,
					bitLength: 10
				});
			}
		}

		if (this.length % 3 === 1) {

			const code = this.cutInt(this.bitLength - 4, 4);

			if (code > 9) {

				mistakes.push({
					value: code,
					blockIndex: len3,
					bitLength: 4
				});
			}
		}

		if (this.length % 3 === 2) {

			const code = this.cutInt(this.bitLength - 7, 7);

			if (code > 99) {

				mistakes.push({
					value: code,
					blockIndex: len3,
					bitLength: 7
				});
			}
		}

		return mistakes;
	}

	toUintArray () {

		const ints = new Uint16Array(Math.ceil(this.bitLength / 10));

		for (let i = 0; i < this.length; i++)

			ints[i] = this.cutInt(i * 10, 10);

		return ints;
	}
}

// const arr = new NumericalArray(11);

// arr.setStr(5, "123989");

// console.log(b(arr.toUintArray(), 10));
// console.log(arr.toUintArray());