import { Alphanum, AlphanumArray } from "./libs/Alphanum";
import { Gen, rand, randFrom } from "./libs/beans";


class Charblock {

	constructor ( block, safe ) {

		this.block = block;
		this.safe = Boolean(safe);
	}
};

const charblocks = Gen(
	Array,
	20,
	i => {

		const length = Math.round( rand(1, 24) );

		const str = Gen( String, length, () => randFrom(Alphanum.__ref) );

		return new Charblock( new AlphanumArray(length).setStr( 0, str ), i === 3 );
	}
);

const data = charblocks.map( cb => cb.block.type[0].toUpperCase() + cb.block.getStr().replace(/\s/g, "_") ).join("");

const width = 20;
let table = "";
let c = 0;
let sum = 0;

for (let i = 0; i < data.length; i++) {

	if (i - c === sum && c < charblocks.length) {

		table += "\x1b[0m";

		switch ( charblocks[c].block.type ) {
			case "alphanumerical":
				table += "\x1b[43m";
				break;
			case "numerical":
				table += "\x1b[32m";
				break;
			case "byte":
				table += "\x1b[36m";
				break;
			case "binary":
				table += "\x1b[37m";
				break;
			default:
				throw `Unknown type!`;
		}

		table += data[i] + "\x1b[0m";

		if ( !charblocks[c].safe ) {

			table += "\x1b[2m";
		}

		sum += charblocks[c++].block.length;

	} else {

		table += data[i];
	}

	if (i % width === width - 1) {

		table += "\n";
	}
}

console.log(table, "\x1b[0m");