import { useState } from "react";

export const Editor = props => {

	return (
		<div
			className="w-screen bg-gray-800 h-screen grid grid-cols-3 grid-rows-1 gap-4 p-4"
		>
			<div
				className="w-fit bg-gray-900 rounded-md self-center p-2 space-y-2 clip-bulged-md-sm-md"
			>
				<div
					className="w-16 h-16 text-gray-300 text-center rounded-sm bg-gray-800 clip-bulged-sm-sm-md"
				>
					P
				</div>
				<div
					className="w-16 h-16 text-gray-300 text-center rounded-sm bg-gray-800 clip-bulged-sm-sm-md"
				>
					L
				</div>
				<div
					className="w-16 h-16 text-gray-300 text-center rounded-sm bg-gray-800 clip-bulged-sm-sm-md hover:bg-slate-400"
				>
					E
				</div>
			</div>
			<div
				className=""
			>
			</div>
			<div
				className="bg-gray-900 rounded-md"
			>
				<textarea
					name=""
					id=""
					cols="30"
					rows="10"
					className="text-gray-300 outline-0"
				>
				</textarea>
			</div>
		</div>
	);
};