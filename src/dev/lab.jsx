import { useState, useRef, useReducer, useEffect } from "react";
import { AlphanumArray } from "../libs/Alphanum";
import { NumericalArray } from "../libs/Numerical";
import { BinaryAsArray } from "../libs/BinaryAsArray";
import { ByteArray } from "../libs/Byte";


const data = [
	new AlphanumArray(12),
	new NumericalArray(12),
	new ByteArray(12, "windows1251"),
	new BinaryAsArray(120),
	new AlphanumArray(12),
	new NumericalArray(12),
	new ByteArray(12, "windows1251"),
	new BinaryAsArray(120),
	new AlphanumArray(12),
	new NumericalArray(12),
	new ByteArray(12, "windows1251"),
	new BinaryAsArray(120),
	new AlphanumArray(12),
	new NumericalArray(12),
	new ByteArray(12, "windows1251"),
	new BinaryAsArray(120)
];

const Datablock = ({ datablock }) => {

	let color;

	switch (datablock.type) {
		case "alphanumerical":
			color = "text-yellow-400 bg-yellow-800";
			break;
		case "numerical":
			color = "text-green-400 bg-green-800";
			break;
		case "byte":
			color = "text-blue-400 bg-blue-800";
			break;
		default:
			color = "text-red-400 bg-red-800";
			break;
	}

	return (

		<span
			className={color + " break-words whitespace-break-spaces"}
			content={datablock.type}
		>
			{datablock.type}
		</span>
	);
};

export const Lab = props => {

	return (
		<div
			className="
				flex w-screen h-screen items-center justify-center
				bg-slate-500
			"
		>
			<div
				className="w-60 bg-slate-600 overflow-hidden font-mono text-slate-300"
			>
				{data.map((item, i) => 

					<Datablock datablock={item} key={i} />
				)}
			</div>
		</div>
	);
};