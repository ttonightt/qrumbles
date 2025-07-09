import { useState, useRef, useLayoutEffect, useEffect, createContext } from "react";
import { Uint8ArrayX2 } from "./libs/Uint8ArrayX2";
import { CSSNamedColors } from "./libs/CSSNamedColors";

class CanvasPlain {

	constructor (x, y, width, height, min, max) {

		this.x = x;
		this.y = y;
		this.__width = width;
		this.__height = height;
		this.width = width;
		this.height = height;

		this.scale = 1;
		this.min = min;
		this.max = max;
	}

	move (x, y) {

		this.x = x;
		this.y = y;
	}

	toScale (sign, x, y) {

		const coef_ = this.scale + sign;

		if (coef_ < this.min || this.max < coef_) return;

		this.x = x - ((x - this.x) * coef_ / this.scale);
		this.y = y - ((y - this.y) * coef_ / this.scale);
		this.width = this.__width * coef_;
		this.height = this.__height * coef_;
		this.scale = coef_;
	}
}

let bmp = new Uint8ArrayX2([
	0,0,0,5,0,1,4,0,
	0,1,0,3,0,0,0,0,
	0,0,2,6,0,7,0,3,
	0,4,0,2,0,0,6,2,
	0,2,3,0,4,0,0,5,
	0,4,7,0,6,5,0,2,
	0,0,0,7,0,0,0,0,
	0,1,1,0,5,0,3,1
], 8).scale(6);

const palette = [
	"white",
	"black",
	"tomato",
	"red",
	"olive",
	"green",
	"cyan",
	"blue"
].map(name => CSSNamedColors[name]);

const plain = new CanvasPlain(256, 256, 256, 256, 1, 6);

export const Canvas = props => {

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

		ctx.fillRect(plain.x, plain.y, plain.width, plain.height);
		ctx.putImageData(bmp.scale(plain.scale).toImageData(palette), plain.x, plain.y);

	}, [rect]);

	const handleWheel = e => {

		plain.toScale(-Math.sign(e.deltaY), e.clientX - rect.x, e.clientY - rect.y);
		ctx.clearRect(0, 0, rect.width, rect.height);
		ctx.fillRect(plain.x, plain.y, plain.width, plain.height);
		ctx.putImageData(bmp.scale(plain.scale).toImageData(palette), plain.x, plain.y);
	};

	const handleMouseDown = e => {

		buffer.mouseDownButton = e.button;
		buffer.mouseDownDX = e.clientX - rect.x - plain.x;
		buffer.mouseDownDY = e.clientY - rect.y - plain.y;
	};

	const handleMouseMove = e => {

		if (buffer.mouseDownButton === 1) {

			plain.move(e.clientX - rect.x - buffer.mouseDownDX, e.clientY - rect.y - buffer.mouseDownDY);
			ctx.clearRect(0, 0, rect.width, rect.height);
			ctx.fillRect(plain.x, plain.y, plain.width, plain.height);
			ctx.putImageData(bmp.scale(plain.scale).toImageData(palette), plain.x, plain.y);
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