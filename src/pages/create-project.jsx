import { Suspense, useRef, useState, useLayoutEffect } from "react";

const promise = prom => {
	let sts = "pending",
		res_;

	const prom_ = prom.then(
		res => {
			sts = "success";
			res_ = res;
		},
		err => {
			sts = "error";
			res_ = err;
		}
	);

	const read = () => {

		switch (sts) {
			case "pending":
				throw prom_;
			case "error":
				throw res_;
			default:
				return res_;
		}
	};

	return {read};
};

const useLoad = promise(new Promise(res => window.onload = () => res())).read;

const TextMeasurer = {

	ctx: document.createElement("canvas").getContext("2d"),

	getWidth (string, font) {
		TextMeasurer.ctx.font = font;

		return TextMeasurer.ctx.measureText(string).width;
	}
};

const ExpandingInput = props => {

	useLoad();

	const ref = props.ofRef ?? useRef(null);
	const emptyInputWidth = useRef("auto");

	const [width, setWidth] = useState();

	const _value = useRef();

	useLayoutEffect(() => {

		const width_ = props.placeholder ? Math.ceil(
			TextMeasurer.getWidth(
				props.placeholder,
				getComputedStyle(ref.current).font
			)
		) : 0;
		
		emptyInputWidth.current = width_ > 0 ? width_ + "px" : null;

	}, [props.placeholder, props.className]);

	useLayoutEffect(() => {

		if (_value.current !== props.ofValue) {

			console.log("useLayoutEffect");

			const width_ = Math.ceil(
				TextMeasurer.getWidth(
					props.ofValue,
					getComputedStyle(ref.current).font
				)
			);

			setWidth(props.ofValue !== undefined && width_ > 0 ? width_ + "px" : emptyInputWidth.current);
			//		 ^^^^^^^^^^^^^^^^^^^^^^^^^^^ QUICK FIX!!!!
		}
	}, [props.ofValue]);

	const handleChange = e => {

		setWidth(
			e.target.value === ""
			?
			emptyInputWidth.current
			:
			Math.ceil(TextMeasurer.getWidth(e.target.value, getComputedStyle(ref.current).font)) + "px"
		);

		_value.current = e.target.value;
		props.setValueBy(e.target.value);
	}

	return (<>
		<input
			ref={ref}
			style={{
				...props.style,
				width
			}}
			value={props.ofValue}
			onChange={handleChange}
			onBlur={props.onBlur}
			className={props.className}
			placeholder={props.placeholder}
			minLength={props.minLength}
			maxLength={props.maxLength}
			pattern={props.pattern}
		/>
	</>);
};

export const CreateProject = props => {

	const [name, setName] = useState("Hello");

	return (<>
		<Suspense fallback={<div className="h-4r p-1r w-3 text-3xl"></div>}>
			<ExpandingInput
				type="text"
				className="
					min-w-24 font-mono text-3xl font-black text-slate-800 bg-slate-300 p-5 box-content w-5 block bulged-x-md-md outline-none
				"
				placeholder="Name"
				ofValue={name}
				setValueBy={setName}
			/>
		</Suspense>
	</>);
};