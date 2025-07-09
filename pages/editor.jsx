import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { Canvas } from "../src/Components";

import { Alphanum } from "../src/libs/alphanum";

export const ProjectEditor = props => {

	return (<>
		<div className="w-screen h-screen bg-slate-600">
			<div className="w-3/4 h-full float-left relative">
				<Canvas
					className="absolute z-0 w-full h-full"
				/>
				<div className="absolute inset-0 backdrop-blur-lg radial-mask"></div>
				<div className="
					flex flex-col gap-2 absolute bottom-0
					w-fit rounded-md p-2 bulged-y-sm-sm backdrop-blur-md bg-slate-100/0  duration-100
					hover:bulged-y-md-md hover:bg-slate-100/20"
				>
					<div
						className="font-mono font-bold w-16 h-16 duration-150 text-gray-900 leading-10 text-center rounded-sm bulged-y-md-md hover:bg-slate-100/20 cursor-pointer hover:text-slate-100"
					>
						Pen
					</div>
					<div
						className="font-mono font-bold w-16 h-16 duration-150 text-gray-900 leading-10 text-center rounded-sm bulged-y-md-md hover:bg-slate-100/20 cursor-pointer hover:text-slate-100"
					>
						Lin
					</div>
					<div
						className="font-mono font-bold w-16 h-16 duration-150 text-gray-900 leading-10 text-center rounded-sm bulged-y-md-md hover:bg-slate-100/20 cursor-pointer hover:text-slate-100"
					>
						Eli
					</div>
				</div>
			</div>
			<div className="w-2 -mx-1 h-full bg-red-600 float-left z-10 relative cursor-col-resize"></div>
			<div
				className="w-1/4 h-full float-left bg-gray-900 rounded-md bulged-y-sm-sm p-6"
			>
				<textarea
					name=""
					id=""
					cols="26"
					rows="10"
					className="text-gray-300 outline-0 bulged-y-sm-sm bg-slate-800 p-3"
				>
				</textarea>
				{/* <div className="bg-slate-300 font-mono font-bold text-slate-900 text-center py-5 bulged-x-md-sm cursor-pointer">
					Prijavi se zdaj
				</div>
				<div
					className="
						relative bg-slate-800 text-lg font-mono font-black text-slate-400 text-center py-5 bulged-x-md-sm cursor-pointer duration-300
						hover:underline
					"
				>Prijavi se zdaj</div> */}
			</div>
		</div>
	</>);
};