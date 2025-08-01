import { useState, useRef, useReducer, useEffect } from "react";
import { AlphanumArray } from "../libs/Alphanum";
import { NumericalArray } from "../libs/Numerical";
import { BinaryAsArray } from "../libs/BinaryAsArray";
import { ByteArray } from "../libs/Byte";


const data = [
	new AlphanumArray(12),
	new NumericalArray(12),
	new ByteArray(12, "windows1251"),
	new BinaryAsArray(120)
];

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
				{data.map((item, i) => (

					<span
						key={i}
						className="inline"
						content={item.type}
					>
						{item.type}
					</span>
				))}
			</div>
		</div>
	);
};