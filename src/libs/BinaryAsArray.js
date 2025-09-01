import { putBits, sliceBits, b8, bitOffset8, b, clearLastBits, ones } from "./beans";

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
	
				const ff8 = bitOffset8(ff);

				const k8 = bitOffset8(k);

				const buffBitLength = Math.min(
					ff8[2],
					bin.bitLength - ff,
					k8[2]
				);

				const buff = bin.bytes[ ff8[1] ] >> (ff8[2] - buffBitLength);

				full.bytes[ k8[1] ] += buff << (k8[2] - buffBitLength);

				ff += buffBitLength;
				k += buffBitLength;
			}
		}

		return full;
	}

	constructor (bitLength) {

		if (bitLength <= 0) throw new TypeError("...");

		this.bitLength = bitLength;
		this.bytes = new Uint8Array(Math.ceil(this.bitLength / 8));
		this.padBits = this.bytes.length * 8 - this.bitLength;

		this.type = "binary";
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

		let int = sliceBits(this.bytes[ b0[1] ], b0[2], 0);

		console.log(int.toString(2));

		for (let j = b0[1] + 1; j < b[1]; j++) {

			int <<= 8;
			int += this.bytes[j];
		}

		if (b[0] && b0[1] < b[1]) {

			int <<= b[0];
			int += sliceBits(this.bytes[b[1]], b[0], b[2]);
		}

		return int;
	}

	static transferBits (target, source, t0, blen, s0 = 0) {

		if ( !(target instanceof BinaryAsArray) ) throw `target argument must be an instance of BinaryAsArray`;
		if ( !(source instanceof BinaryAsArray) ) throw `source argument must be an instance of BinaryAsArray`;
		if ( !(0 <= t0 && t0 < target.bitLength) ) throw `t0 argument is out of range (must be >= 0 and < target.bitLength)`;

		blen = Math.min(
			target.bitLength - t0,
			source.bitLength - s0,
			blen
		);
		
		let t = t0;
		let s = s0;

		const se = blen + s0;

		while (s < se) {

			const s8 = bitOffset8(s);

			const t8 = bitOffset8(t);

			const buffBitLength = Math.min(
				s8[2],
				se - s,
				t8[2]
			);

			const srcShift = s8[2] - buffBitLength;
			const trgShift = t8[2] - buffBitLength;

			const buff = ( source.bytes[ s8[1] ] >> srcShift ) & ones(buffBitLength);

			const mask = ( ones(8 - buffBitLength - trgShift) << (buffBitLength + trgShift) ) + ones(trgShift);

			target.bytes[ t8[1] ] = ( target.bytes[ t8[1] ] & mask ) + ( buff << trgShift );

			s += buffBitLength;
			t += buffBitLength;
		}
	}

	putBitArray (src, k0) {

		if (k0 >= this.bitLength) return this;

		const blen =
			src.bitLength + k0 >= this.bitLength
			?
			this.bitLength - k0
			:
			src.bitLength;

		let k = k0;
		let ff = 0;

		while (ff < blen) {

			const ff8 = bitOffset8(ff);

			const k8 = bitOffset8(k);

			const buffBitLength = Math.min(
				ff8[2],
				blen - ff,
				k8[2]
			);

			const srcShift = ff8[2] - buffBitLength;
			const trgShift = k8[2] - buffBitLength;

			const buff = src.bytes[ ff8[1] ] >> srcShift;

			const mask = ( ones(8 - buffBitLength - trgShift) << (buffBitLength + trgShift) ) + ones(trgShift);

			this.bytes[ k8[1] ] = ( this.bytes[ k8[1] ] & mask ) + ( buff << trgShift );

			ff += buffBitLength;
			k += buffBitLength;
		}
	}

	cutBitArray (ff0, blen) {

		const target = new BinaryAsArray(blen);

		let k = 0;
		let ff = ff0;
		const ffe = blen + ff0;

		while (ff < ffe) {

			const ff8 = bitOffset8(ff);

			const k8 = bitOffset8(k);

			const buffBitLength = Math.min(
				ff8[2],
				ffe - ff,
				k8[2]
			);

			const srcShift = ff8[2] - buffBitLength;
			const trgShift = k8[2] - buffBitLength;

			const buff = this.bytes[ ff8[1] ] >> srcShift;

			const mask = ( ones(8 - buffBitLength - trgShift) << (buffBitLength + trgShift) ) + ones(trgShift);

			target.bytes[ k8[1] ] = ( target.bytes[ k8[1] ] & mask ) + ( buff << trgShift );

			ff += buffBitLength;
			k += buffBitLength;
		}

		return target;
	}
}

for (let i = 0; i < 36; i++) {

	const arr1 = new BinaryAsArray(35);

	arr1.bytes[0] = 0b11111111;
	arr1.bytes[1] = 0b11111111;
	arr1.bytes[2] = 0b11111111;
	arr1.bytes[3] = 0b11111111;
	arr1.bytes[4] = 0b11100000;

	const arr2 = new BinaryAsArray(4);

	arr2.bytes[0] = 0b01100000;

	arr1.putBitArray(arr2, i);

	console.log(b8(arr1.bytes).join().replaceAll(",", ""));
}


const arr1 = new BinaryAsArray(35);

arr1.bytes[0] = 0b10101010;
arr1.bytes[1] = 0b01010101;
arr1.bytes[2] = 0b11001100;
arr1.bytes[3] = 0b00110011;
arr1.bytes[4] = 0b11100000;

const arr2 = new BinaryAsArray(13);

arr2.bytes[0] = 0b11111111;
arr2.bytes[1] = 0b11111000;

BinaryAsArray.transferBits(arr1, arr2, 3, 8, 10);

console.log(b8(arr1.bytes).join().replaceAll(",", ""));