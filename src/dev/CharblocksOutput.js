import seedrandom from "seedrandom";
import Charblocks from "../Charblocks";
import { Alphanum, AlphanumArray } from "../libs/Alphanum";
import { digits, Gen } from "../libs/beans";
import { BinaryAsArray } from "../libs/BinaryAsArray";


const random = seedrandom(4);

const charblocks = new Charblocks(
	Gen(
		Array,
		20,
		i => {

			if (i === 6) return new BinaryAsArray(6);

			const length = Math.round( random() * 20 ) + 1;

			const str = Gen( String, length, () => Alphanum.__ref[ Math.round(random() * (Alphanum.__ref.length - 1)) ] );

			return new AlphanumArray(length).setStr( 0, str );
		}
	),
	1000
);

charblocks.setSafety(3, true);
charblocks.setSafety(7, true);
charblocks.cut(2);

const data = charblocks.blocks.map( ({data}) => data.type === "binary" ? "" : data.getStr().replace(/\s/g, "_") ).join("");

const width = 20;
let table = "";
let c = 0;
let sum = 0;

for (let i = 0; i < data.length; i) {

	if ((i + c) % width === 0 && i !== 0) {

		table += "↲\n";
	}

	if (i === sum && c < charblocks.blocks.length) {

		table += "\x1b[0m";

		switch ( charblocks.blocks[c].data.type ) {
			case "alphanumerical":
				table += "\x1b[43mA";
				break;
			case "numerical":
				table += "\x1b[32mN";
				break;
			case "byte":
				table += "\x1b[36mB";
				break;
			case "binary":
				table += "\x1b[41m\x1b[2m" + charblocks.blocks[c].data.bitLength;
				break;
			default:
				throw `Unknown type!`;
		}

		table += "\x1b[0m";

		if ( !charblocks.blocks[c].safe ) {

			table += "\x1b[2m";
		}

		sum += charblocks.blocks[c].data.type === "binary" ? digits(charblocks.blocks[c].data.bitLength, 10) - 1 : charblocks.blocks[c].data.length;
		c++;

	} else {

		table += data[i++];
	}
}

//console.log( charblocks.blocks.map( ({data}) => data.type === "binary" ? "" : data.getStr() ) );
console.log(table, "\x1b[0m");