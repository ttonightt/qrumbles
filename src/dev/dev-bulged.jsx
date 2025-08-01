import { useState, useRef, useReducer, useEffect } from "react";
import { generateBulged } from "../libs/bulged";
import { DOWNLOADER } from "../main";



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


const r = n => Math.round(n * 100) / 100; // !!!!

export const Example = props => {

	const [bulgeX, setBulgeX] = useState(50);
	const [bulgeY, setBulgeY] = useState(20);
	const [roundness, setRoundness] = useState(10);
	const [shrinknessX, setShrinknessX] = useState(50);
	const [shrinknessY, setShrinknessY] = useState(50);

	const bulged = generateBulged(bulgeX / 100, bulgeY / 100, roundness / 100);

	const path = bulged.toPath();

	const clipPath = bulged.toClipPolygon(0.5, shrinknessX / 100, shrinknessY / 100);

	return (<>
		Bulging X:
		<input
			type="range"
			min={1}
			max={99}
			value={bulgeX}
			onChange={args => {setBulgeX(args.target.value)}}
			name=""
			id=""
		/>
		Bulging Y:
		<input
			type="range"
			min={1}
			max={99}
			value={bulgeY}
			onChange={args => {setBulgeY(args.target.value)}}
			name=""
			id=""
		/>
		Radius:
		<input
			type="range"
			min={0}
			max={99}
			value={roundness}
			onChange={args => {setRoundness(args.target.value)}}
			name=""
			id=""
		/>
		Shrinkness X:
		<input
			type="range"
			min={0}
			max={99}
			value={shrinknessX}
			onChange={args => {setShrinknessX(args.target.value)}}
			name=""
			id=""
		/>
		Shrinkness Y:
		<input
			type="range"
			min={0}
			max={99}
			value={shrinknessY}
			onChange={args => {setShrinknessY(args.target.value)}}
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
		{bulgeX + ", " + bulgeY + ", " + roundness + ", " + shrinknessX + ", " + shrinknessY}
		<div style={{
				width: "300px",
				height: "300px",
				clipPath
			}}
			className="bg-red-400 inline-block"
		>
		</div>
		<div className="bg-slate-800 w-24 h-24 inline-block bulged-md-md"></div>
		<div className="bg-slate-800 w-80 h-80 inline-block bulged-y-md-md"></div>
		<div className="bg-slate-800 w-80 h-24 inline-block bulged-x-md-md"></div>
		<div style={{
				width: "100px",
				height: "100px",
				clipPath
			}}
			className="bg-red-400 animation"
		>
		</div>
		<button onClick={() => downloadFile(compileSVGPath(path, `Bulged-${parseInt(bulgeX)}-${parseInt(bulgeY)}-${parseInt(roundness)}`))}>
			Save Path SVG
		</button>
	</>);
};