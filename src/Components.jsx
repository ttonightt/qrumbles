import { useState, useRef, useLayoutEffect, useEffect, createContext, useMemo } from "react";
import { QRMX } from "./QRMX";

class CanvasPlain {

	constructor (x, y, width, height, min, max) {

		this.x = x;
		this.y = y;
		this.__width = width;
		this.__height = height;
		this.width = width;
		this.height = height;

		this.scale = 1;
	}

	toMove (x, y) {

		this.x = Math.floor(x);
		this.y = Math.floor(y);
	}

	toMoveCenter (x, y) {

		this.x = Math.floor(x - (this.width / 2));
		this.y = Math.floor(y - (this.height / 2));
	}

	toScaleOn (d, x, y) {

		this.toScale(this.scale + d, x, y);
	}

	toScale (value, x, y) {

		if (this.scaleMin > 0 && value <= this.scaleMin) return;
		if (this.scaleMax     && this.scaleMax < value) return;

		this.x = x - ((x - this.x) * value / this.scale);
		this.y = y - ((y - this.y) * value / this.scale);
		this.width = this.__width * value;
		this.height = this.__height * value;
		this.scale = value;
	}

	resetScaleRange (min, max) {
		this.scaleMin = min;
		this.scaleMax = max;
	}

	toFitInto (width, height, padding = 0) {

		const minContainerSize = Math.min(width - padding, height - padding);
		const minPlainSize = Math.min(this.__width, this.__height);

		this.toMoveCenter(width / 2, height / 2);
		this.toScale(Math.floor(minContainerSize / minPlainSize) || 1, width / 2, height / 2);
	}
}

export const CanvasWorkspace = props => {

	const plain = useMemo(() => new CanvasPlain(0, 0, props.initSize, props.initSize), []);

	const canvasRef = useRef(null);
	const buffRef = useRef({

		mouseDownButton: -1
	});

	const buffer = buffRef.current;

	const [rect, setRect] = useState(null);
	const [ctx, setCtx] = useState(null);

	useEffect(() => {

		const resize = () => {

			setRect(canvasRef.current.getBoundingClientRect());

			console.log("resize");
		};

		window.addEventListener("resize", resize);

		canvasRef.current.ondragstart = e => {

			e.preventDefault();
		};

		setCtx(canvasRef.current.getContext("2d"));

		resize();

		return () => {

			window.removeEventListener("resize", resize);
		};
	}, []);

	useEffect(() => {

		if (!rect) return;

		console.log("rect reassignment");

		ctx.clearRect(0, 0, rect.width, rect.height);
		props.onInit(ctx, plain, rect);

	}, [rect]);

	const handleWheel = e => {

		plain.toScaleOn(-Math.sign(e.deltaY), e.clientX - rect.x, e.clientY - rect.y);
		ctx.clearRect(0, 0, rect.width, rect.height);
		props.onInteraction(ctx, plain, rect);
	};

	const handleMouseDown = e => {

		buffer.mouseDownButton = e.button;
		buffer.mouseDownDX = e.clientX - rect.x - plain.x;
		buffer.mouseDownDY = e.clientY - rect.y - plain.y;
	};

	const handleMouseMove = e => {

		if (buffer.mouseDownButton === 1) {

			plain.toMove(e.clientX - rect.x - buffer.mouseDownDX, e.clientY - rect.y - buffer.mouseDownDY);
			ctx.clearRect(0, 0, rect.width, rect.height);
			props.onInteraction(ctx, plain);
		}
	};

	const handleMouseUp = e => {

		buffer.mouseDownButton = -1;
	};

	return (
		<canvas
			width={rect?.width}
			height={rect?.height}
			ref={canvasRef}
			className={props.className}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onWheel={handleWheel}
		></canvas>
	);
};