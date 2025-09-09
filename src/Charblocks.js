
class Charblocks {

	static create ( data, safe ) {

		return {
			data,
			safe: Boolean(safe)
		};
	}

	constructor (sources) {

		this.blocks = sources.map( src => Charblocks.create(src, false) );
	}

	setSafety (i, bool) {

		this.blocks[i].safe = Boolean(bool);
	}

	paste () {

		
	}

	copy () {

	}

	cut () {

	}

	moveStart () {

	}

	moveEnd () {

	}
};

export default Charblocks;