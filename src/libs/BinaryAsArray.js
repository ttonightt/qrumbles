import { putBits, sliceBits, b8, bitOffset8, b, clearLastBits, ones, bitLength, isIntArray, isInt8Array } from "./beans";

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

		const blen_ = Math.min(
			target.bitLength - t0,
			source.bitLength - s0
		);

		const blen__ = blen === undefined ? blen_ : Math.min(blen_, blen);
		
		let t = t0;
		let s = s0;

		const se = s0 + blen__;

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

	static from (_arr, bitLength) {

		if ( !(bitLength === undefined || bitLength > 0) ) throw `bitLength argument is out of range (must be > 0 if provided)`;

		let arr, blen;

		if ( isInt8Array(_arr) ) {

			arr = _arr;
			blen = _arr.length * 8;
		}
		else if ( _arr instanceof BinaryAsArray ) {

			arr = _arr.bytes;
			blen = _arr.bitLength;
		}
		else throw `Unsupported type of arr argument, must either from another BinaryAsArray or typed IntArray! Got: ${arr}`;


		const blen_ = bitLength || blen;
		const arr_ = new BinaryAsArray(blen_);

		const minlen = Math.min(arr_.bytes.length, arr.length);

		for (let i = 0; i < minlen; i++)

			arr_.bytes[i] = arr[i];

		arr_.bytes[ arr_.bytes.length - 1 ] = clearLastBits( arr_.bytes[ minlen - 1 ], (arr_.bytes.length * 8) - blen_ );

		return arr_;
	}

	constructor (bitLength) {

		if (bitLength <= 0) throw new TypeError("...");

		this.bitLength = bitLength;
		this.bytes = new Uint8Array(Math.ceil(this.bitLength / 8));
		this.padBits = this.bytes.length * 8 - this.bitLength;

		this.type = "binary";
	}

	setInt (int, t0, blen) {

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

	getInt (s0, blen) {

		if ( blen <= 0 ) throw `passed blen argument (bit range) is out of range (must be <= 52 and > 0)!`;
		if ( blen > 52 ) throw `passed blen argument (bit range) is too wide to capture safe integer (must be <= 52 and > 0)! The preciosion of output may be lost! Split the number on pieces or int array`;
		if ( !(0 <= s0 && s0 < this.bitLength) ) throw `s0 argument is out of range (must be >= 0 and < array bitLength)`;
		if ( !(blen > 0 && blen < this.bitLength - s0) ) throw `blen argument is out of range (must be > 0 and < array bitLength - t0)`;

		let s = s0;

		let int = 0;

		const se = s0 + blen;

		while (s < se) {

			const s8 = bitOffset8(s);

			const buffBitLength = Math.min(
				s8[2],
				se - s
			);

			const srcShift = s8[2] - buffBitLength;

			int <<= buffBitLength;
			int += ( this.bytes[ s8[1] ] >> srcShift ) & ones(buffBitLength);

			s += buffBitLength;
		}

		return int;
	}

	setBitArray (source, t0, blen, s0 = 0) {

		BinaryAsArray.transferBits(this, source, t0, blen, s0);

		return this;
	}

	getBitArray (s0, blen) {

		const target = new BinaryAsArray(blen ?? this.bitLength - s0);

		BinaryAsArray.transferBits(target, this, 0, blen, s0);

		return target;
	}
}