import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { CanvasWorkspace } from "../Components";
import { QRMX } from "../QRMX";
import { CWData } from "../QR";
import { BinaryAsArray } from "../libs/BinaryAsArray";
import { AlphanumArray } from "../libs/Alphanum";
import { palette } from "../palette";
import { Rect8 } from "../libs/Rect8";

export const ProjectEditor = props => {

	const mx = useMemo(() => new QRMX(20), []);

	const bitStream = useMemo(() => {

		return BinaryAsArray
			.join(
				new AlphanumArray(9).setStr(3, "R3RR"),
				new AlphanumArray(4).setStr(2, "4"),
				new AlphanumArray(6).setStr(1, "FEU"),
				new AlphanumArray(1).setStr(0, "H")
			)
			.assignToInt8(
				new Uint8Array(CWData[20].L.cw)
			);
	}, []);

	const handleInteraction = (ctx, plain) => {

		ctx.putImageData(mx.toImageData(plain.scale, palette), plain.x, plain.y);
	};

	const handleInit = (ctx, plain, rect) => {

		plain.toMoveCenter(rect.width / 2, rect.height / 2);
		plain.toFitInto(rect.width, rect.height, 300);
		plain.resetScaleRange(plain.scale > 1 || 2, 10);

		handleInteraction(ctx, plain);
	};

	mx.applyBitStream(bitStream, 100);

	return (<>
		<div className="w-screen h-screen bg-slate-600">
			<div className="w-3/4 h-full float-left relative">
				<CanvasWorkspace
					initSize={mx.size}
					onInit={handleInit}
					onInteraction={handleInteraction}
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