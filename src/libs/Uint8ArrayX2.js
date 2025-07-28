import { Rect8 } from "./Rect8";

export class Uint8ArrayX2 extends Uint8Array {

	static from (arr) {

		if (arr instanceof Uint8ArrayX2) {

			return new Uint8ArrayX2(arr, arr.rows);
		}
	}

	constructor (arrOcols, rows) {

		if (rows < 1) throw new Error("..."); // <<<

		if (typeof arrOcols === "number") {

			const cols = arrOcols;

			super(cols * rows);
			this.rows = rows;
			this.cols = cols;

		}
		else if (arrOcols instanceof Array) {

			const arr = arrOcols;

			if ((arr.length / rows) % 1) throw new Error("..."); // <<<

			super(arr);
			this.rows = rows;
			this.cols = arr.length / rows;

		} else throw new Error("..."); // <<<

		this.width = this.cols;
		this.height = this.rows;
	}

	x2get (x = 0, y = 0) {
		return this[(y * this.cols) + x];
	}

	x2set (x = 0, y = 0, int) {
		this[(y * this.cols) + x] = int;
	}

	x2cut (x0, y0, width, height) {

		const frame = new Uint8Array(width * height);

		let x, y;

		for (y = 0; y < height; y++) {
			for (x = 0; x < width; x++) {

				frame[(y * width) + x] = this[((y + y0) * width) + (x + x0)];
			}
		}

		return frame;
	}

	x2put (intx2, x0, y0, dirtyX = 0, dirtyY = 0, dirtyWidth, dirtyHeight) {

		dirtyWidth ||= intx2.width;
		dirtyHeight ||= intx2.height;

		let x, y;

		for (y = 0; y < dirtyHeight; y++) {
			for (x = 0; x < dirtyWidth; x++) {

				this.x2set(x + x0, y + y0, intx2.x2get(x + dirtyX, y + dirtyY));
			}
		}
	}

	x2fill (value, x0, y0, w, h) {

		w = Math.min(w + x0, this.cols) - x0;
		h = Math.min(h + y0, this.rows) - y0;

		let dx, dy;

		for (dy = 0; dy < h; dy++)

			for (dx = 0; dx < w; dx++)
				
				this.x2set(x0 + dx, y0 + dy, value);
	}

	scale (scale) {

		const smx = new Uint8ArrayX2(this.cols * scale, this.rows * scale);

		let dx, dy;

		for (dy = 0; dy < this.rows; dy++)

			for (dx = 0; dx < this.cols; dx++)

				smx.x2fill(this.x2get(dx, dy), dx * scale, dy * scale, scale, scale);

		return smx;
	}

	toString () {

		let str = "";

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {

				const value = this[(y * this.cols) + x];

				str += (value < 100 ? " " : "") + (value < 10 ? " " : "") + " " + value;
			}

			str += "\n\n";
		}

		return str;
	}
}