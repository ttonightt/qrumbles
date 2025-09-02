import { putBits, sliceBits, b8, bitOffset8, b, clearLastBits, ones, bitLength, isIntArray } from "./beans";

export class BinaryAsArray {

	static join (...bitArrays) {

		const fullLength = bitArrays.reduce(( sum, bitArray ) => {

			if ( !(bitArray instanceof BinaryAsArray) ) throw new Error("...");

			return sum + bitArray.bitLength;
		}, 0);

		const full = new BinaryAsArray(fullLength);

		let t = 0;

		for (const bitArray of bitArrays) {

			this.transferBits(full, bitArray, t);

			t += bitArray.bitLength;
		}

		return full;
	}

	static transferBits (target, source, t0, blen, s0 = 0) {

		if ( !(target instanceof BinaryAsArray) ) throw `target argument must be an instance of BinaryAsArray`;
		if ( !(source instanceof BinaryAsArray) ) throw `source argument must be an instance of BinaryAsArray`;
		if ( !(0 <= t0 && t0 < target.bitLength) ) throw `t0 argument is out of range (must be >= 0 and < target.bitLength)`;
		if ( !(blen === undefined || blen > 0) ) throw `blen argument is out of range (must be > 0 if provided)`;

		const fit = Math.min(
			target.bitLength - t0,
			source.bitLength - s0
		);
		
		let t = t0;
		let s = s0;

		const se = s0 + ( blen === undefined ? fit : Math.min(fit, blen) );

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

	static fromIntArray (arr, padBits = 0) {

		if ( isIntArray(arr) ) {

			padBits %= 8;

			const arr_ = new BinaryAsArray(arr.length * 8 - padBits);

			for (let i = 0; i < arr.length; i++)

				arr_[i] = arr[i];

			return arr_;
		}

		throw `Unsupported type of arr argument: ${arr}`;
	}

	static fromArray (arr, padBits = 0) {
		
		if (arr instanceof Array) {

			padBits %= 8;

			const arr_ = new BinaryAsArray(arr.length * 8 - padBits);

			for (let i = 0; i < arr.length; i++) {

				if ( typeof arr[i] !== "number" )
					
					throw `BinaryAsArray cannot be created from Array with such an item: ${arr[i]}`;

				arr_[i] = arr[i];
			}

			return arr_;
		}

		throw `Unsupported type of arr argument: ${arr}`;
	}

	constructor (bitLength) {

		if (bitLength <= 0) throw new TypeError("...");

		this.bitLength = bitLength;
		this.bytes = new Uint8Array(Math.ceil(this.bitLength / 8));
		this.padBits = this.bytes.length * 8 - this.bitLength;

		this.type = "binary";
	}

	assignInt (int, t0, blen) {

		if ( !(Number.isSafeInteger(int)) ) throw `int argument isn't safe (must be < 2^53 - 1 and > -(2^53 - 1))! The preciosion may be lost! Split the number on pieces or int array`;
		if ( !(0 <= t0 && t0 < this.bitLength) ) throw `t0 argument is out of range (must be >= 0 and < array bitLength)`;
		if ( !(blen > 0 && blen < this.bitLength - t0) ) throw `blen argument is out of range (must be > 0 and < array bitLength - t0)`;

		let t = t0;
		let s = 0;

		int &= ones(blen);

		while (s < blen) {

			const t8 = bitOffset8(t);

			const buffBitLength = Math.min(
				blen - s,
				t8[2]
			);

			const trgShift = t8[2] - buffBitLength;
			
			const buff = ( int >> (blen - s - buffBitLength) ) & ones(buffBitLength);

			const mask = ( ones(8 - buffBitLength - trgShift) << (buffBitLength + trgShift) ) + ones(trgShift);

			this.bytes[ t8[1] ] = ( this.bytes[ t8[1] ] & mask ) + ( buff << trgShift );

			s += buffBitLength;
			t += buffBitLength;
		}

		return this;
	}

	putBitArray (source, t0, blen, s0 = 0) {

		BinaryAsArray.transferBits(this, source, t0, blen, s0);

		return this;
	}

	cutBitArray (s0, blen) {

		const target = new BinaryAsArray(blen ?? this.bitLength - s0);

		BinaryAsArray.transferBits(target, this, 0, blen, s0);

		return target;
	}
}