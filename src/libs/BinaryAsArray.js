import { putBits, sliceBits, b8 } from "./beans";

export const bitOffset8 = (ff) => {

	return [
		ff % 8,
		Math.floor(ff / 8),
		8 - (ff % 8)
	];
}

export class BinaryAsArray {

	static join (...bins) {

		const fullLength = bins.reduce((sum, bin) => {

			if (!(bin instanceof BinaryAsArray)) throw new Error("...");

			return sum + bin.bitLength;
		}, 0);

		const full = new BinaryAsArray(fullLength);

		let k = 0;

		for (const bin of bins) {

			let ff = 0;

			while (ff < bin.bitLength) {
	
				const ffB = Math.floor(ff / 8);
				const _ffb = ff % 8;
				const ffb_ = 8 - _ffb;

				const kB = Math.floor(k / 8);
				const kb_ = 8 - (k % 8);

				const buffBitLength = Math.min(
					ffb_,
					bin.bitLength - ff,
					kb_
				);

				const buff = bin.bytes[ffB] >> (ffb_ - buffBitLength);

				full.bytes[kB] += buff << (kb_ - buffBitLength);

				ff += buffBitLength;
				k += buffBitLength;
			}
		}

		return full;
	}

	static fromQRVersion () {

	}

	constructor (bitLength) {

		if (bitLength <= 0) throw new TypeError("...");

		this.bitLength = bitLength;
		this.bytes = new Uint8Array(Math.ceil(this.bitLength / 8));
		this.padBits = this.bytes.length * 8 - this.bitLength;
	}

	assignToInt8 (target) {

		let i = 0;

		for (i; i < this.bytes.length - 1; i++) {

			target[i] = this.bytes[i];
		}

		if (8 - this.padBits) {

			target[i] = (this.bytes[i] >> this.padBits) + (target[i] % (1 << this.padBits));
		}

		return target;
	}

	putInt (ff, blen, int) {

		if (ff >= this.bitLength) return this;

		if (blen + ff >= this.bitLength)

			blen = this.bitLength - ff;

		int %= 1 << blen;

		const b0 = bitOffset8(ff);
		const b = bitOffset8(ff + blen);

		this.bytes[b0[1]] = putBits(this.bytes[b0[1]], int, b0[2], 0, blen - b0[2]);

		for (let j = 1; j < b[1] - b0[1]; j++)

			this.bytes[j + b0[1]] = sliceBits(int, 8, b[0] + ((j - 1) * 8));

		this.bytes[b[1]] = putBits(this.bytes[b[1]], int, b[0], b[2]);

		return this;
	}

	cutInt (ff, blen) {

		if (ff >= this.bitLength) return undefined;

		if (blen + ff >= this.bitLength)

			blen = this.bitLength - ff;

		const b0 = bitOffset8(ff);
		const b = bitOffset8(ff + blen);

		let int = sliceBits(this.bytes[b0[1]], b0[2], 0);

		for (let j = b0[1] + 1; j < b[1]; j++) {

			int <<= 8;
			int += this.bytes[j];
		}

		int <<= b[0];
		int += sliceBits(this.bytes[b[1]], b[0], b[2]);

		return int;
	}
}