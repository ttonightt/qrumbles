import { useState, useRef, useReducer, useEffect } from "react";
import { generateBulged } from "../src/libs/bulged";
import { DOWNLOADER } from "../src/main";



const SVGBase = `<?xml version="1.0" standalone="no"?><svg width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">`;

const compileSVGPath = (path, name) => {
	
	return new File([SVGBase + `<path d="${path}"/></svg>`], name + ".svg");
};

const downloadFile = file => {

	if (file instanceof File) {

		const url = URL.createObjectURL(file);

		DOWNLOADER.href = url;
		DOWNLOADER.download = file.name;
		DOWNLOADER.click();

		URL.revokeObjectURL(url);
	} else
		throw new Error("Received argument isn't a File's instance!");
};

export const Example = props => {

	const [bulgeX, setBulgeX] = useState(50);
	const [bulgeY, setBulgeY] = useState(20);
	const [roundness, setRoundness] = useState(10);

	const {polygon, path} = generateBulged(bulgeX, bulgeY, roundness);

	let clipPath = "polygon(";

	for (let i = 0; i < polygon.length - 1; i++) {

		const c = polygon[i];

		switch (c) {
			case ",":
				clipPath += "% ";
				break;
			case " ":
				clipPath += "%,";
				break;
			default:
				clipPath += c;
		}
	}

	clipPath += "%)";

	return (<>
		<input
			type="range"
			min={1}
			max={99}
			value={bulgeX}
			onChange={args => {setBulgeX(args.target.value)}}
			name=""
			id=""
		/>
		<input
			type="range"
			min={1}
			max={99}
			value={bulgeY}
			onChange={args => {setBulgeY(args.target.value)}}
			name=""
			id=""
		/>
		<input
			type="range"
			min={0}
			max={99}
			value={roundness}
			onChange={args => {setRoundness(args.target.value)}}
			name=""
			id=""
		/>
		<svg
			viewBox="0 0 400 400"
			preserveAspectRatio="none"
			xmlns="http://www.w3.org/2000/svg"
			width={400}
			height={400}
			className="bg-gray-100 m-10"
		>
			<path d={path}/>
		</svg>
		<div style={{
			width: "300px",
			height: "300px",
			clipPath
		}}
			className="bg-red-400"
		>
		</div>
		<button onClick={() => downloadFile(compileSVGPath(path, `Bulged-${parseInt(bulgeX)}-${parseInt(bulgeY)}-${parseInt(roundness)}`))}>
			Save Path SVG
		</button>
	</>);
};