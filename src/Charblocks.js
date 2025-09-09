import { BinaryAsArray } from "./libs/BinaryAsArray";

class Charblocks {

	static create ( data, safe ) {

		return {
			data,
			safe: Boolean(safe)
		};
	}

	constructor (sources, bitLength) {

		this.bitLength = bitLength;

		this.blocks = [];

		let i = 0, left = this.bitLength;

		while ( i < sources.length && left >= sources[i].bitLength ) {

			this.blocks[i] = Charblocks.create( sources[i], false );

			left -= sources[i].bitLength;
			i++;
		}

		if ( left - sources[i].bitLength < 0) {

			const [len] = sources[i].constructor.charsFitInto(left);

			this.blocks[i] = Charblocks.create( sources[i].slice(0, len), false );
		}
	}

	setSafety (i, bool) {

		this.blocks[i].safe = Boolean(bool);
	}

	paste () {

		
	}

	copy () {

	}

	cut (i) {

		const b = this.blocks[i].data;
		const b_ = this.blocks[i + 1].data;

		const joined = BinaryAsArray.join( b, b_ );

		const [chars, mod] = b_.constructor.charsFitInto( joined.bitLength );

		const target = b_.constructor.fromBinary(joined);

		target.validate().forEach( ({ blockIndex, bitLength }) => target.setInt(0, blockIndex * 11, bitLength) );

		if (mod) {

			this.blocks.splice( i + 1, 1, Charblocks.create( new BinaryAsArray(mod) ) );
		} else {

			this.blocks.splice( i + 1, 1 );
		}

		return this.blocks.splice( i, 1, Charblocks.create(target) );
	}

	moveStart () {

	}

	moveEnd () {

	}
};

export default Charblocks;