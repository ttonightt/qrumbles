import { putBits, sliceBits, b8, bitOffset, b, clearLastBits, ones, bitLength, isIntArray, isInt8Array, choose, throwError } from "./beans";

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

	static transferBits (target, source, t0, bitLength, s0 = 0) {

		const [ targetBytes, targetBitLength ] = 
			choose( true,
				[ target instanceof BinaryAsArray, isInt8Array(target) ],
				[
					[ target.bytes,  target.bitLength ],
					[       target, 8 * target.length ]
				]
			) ?? throwError(`_target argument must be an instance of BinaryAsArray or typed Int8Array`);


		if ( !(0 <= t0 && t0 < targetBitLength) )

			throw `t0 argument is out of range (must be >= 0 and < target.bitLength)`;


		const [ sourceBytes, sourceBitLength ] = 
			choose( true,
				[ source instanceof BinaryAsArray, isInt8Array(source) ],
				[
					[ source.bytes,  source.bitLength ],
					[       source, 8 * source.length ]
				]
			) ?? throwError(`_target argument must be an instance of BinaryAsArray or typed Int8Array`);

		bitLength = 
			choose( true,
				[ bitLength === undefined, bitLength > 0 ],
				[
					Math.min( targetBitLength - t0, sourceBitLength - s0 ),
					Math.min( targetBitLength - t0, sourceBitLength - s0, bitLength )
				]
			) ?? throwError(`bitLength argument is out of range (must be > 0 if provided)`);
		
		let t = t0;
		let s = s0;

		const se = s0 + bitLength;

		while (s < se) {

			const s8 = bitOffset(s, 8);
			const t8 = bitOffset(t, 8);

			const buffBitLength = Math.min(
				s8[2],
				se - s,
				t8[2]
			);

			const srcShift = s8[2] - buffBitLength;
			const trgShift = t8[2] - buffBitLength;

			const buff = ( sourceBytes[ s8[1] ] >> srcShift ) & ones(buffBitLength);

			const mask = ( ones(8 - buffBitLength - trgShift) << (buffBitLength + trgShift) ) + ones(trgShift);

			targetBytes[ t8[1] ] = ( targetBytes[ t8[1] ] & mask ) + ( buff << trgShift );

			s += buffBitLength;
			t += buffBitLength;
		}
	}

	static from (source, bitLength) {

		const sourceBitLength = 
			choose( true,
				[ source instanceof BinaryAsArray, isInt8Array(source) ],
				[ source.bitLength, 8 * source.length ]
			) ??
			throwError(`_target argument must be an instance of BinaryAsArray or typed Int8Array`);
		
		bitLength = 
			choose( true,
				[ bitLength === undefined, bitLength > 0 ],
				[ sourceBitLength, bitLength ]
			) ??
			throwError(`bitLength argument is out of range (must be > 0 if provided)`);

		const target = new BinaryAsArray(bitLength);

		this.transferBits( target, source, 0, bitLength );

		return target;
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
		if ( !(blen > 0 && blen <= this.bitLength - t0) ) throw `blen argument is out of range (must be > 0 and < array bitLength - t0)`;

		let t = t0;
		let s = 0;

		int &= ones(blen);

		while (s < blen) {

			const t8 = bitOffset(t, 8);

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
		if ( !(blen > 0 && blen <= this.bitLength - s0) ) throw `blen argument is out of range (must be > 0 and < array bitLength - t0)`;

		let s = s0;

		let int = 0;

		const se = s0 + blen;

		while (s < se) {

			const s8 = bitOffset(s, 8);

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