import seedrandom from "seedrandom";
import Charblocks from "../Charblocks";
import { Alphanum, AlphanumArray } from "../libs/Alphanum";
import { Gen } from "../libs/beans";


const random = seedrandom(1);

const charblocks = new Charblocks(
	Gen(
		Array,
		20,
		() => {

			const length = Math.round( random() * 23 ) + 1;

			const str = Gen( String, length, () => Alphanum.__ref[ Math.round(random() * (Alphanum.__ref.length - 1)) ] );

			return new AlphanumArray(length).setStr( 0, str );
		}
	)
);

charblocks.setSafety(3, true);
charblocks.setSafety(10, true);

const data = charblocks.blocks.map( cb => cb.data.type[0].toUpperCase() + cb.data.getStr().replace(/\s/g, "_") ).join("");

const width = 20;
let table = "";
let c = 0;
let sum = 0;

for (let i = 0; i < data.length; i++) {

	if (i - c === sum && c < charblocks.blocks.length) {

		table += "\x1b[0m";

		switch ( charblocks.blocks[c].data.type ) {
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

		if ( !charblocks.blocks[c].safe ) {

			table += "\x1b[2m";
		}

		sum += charblocks.blocks[c++].data.length;

	} else {

		table += data[i];
	}

	if (i % width === width - 1) {

		table += "\n";
	}
}

console.log(table, "\x1b[0m");