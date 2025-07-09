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
	}

	x2get (x = 0, y = 0) {
		return this[(y * this.cols) + x];
	}

	x2getD (x = 0, y = 0, wrong) {
		if (0 <= x && x < this.cols && 0 <= y && y < this.rows) {
			return this[(y * this.cols) + x];
		} else {
			return wrong;
		}
	}

	x2set (x = 0, y = 0, int) {
		this[(y * this.cols) + x] = int;
	}

	x2setD (x = 0, y = 0, int) {
		if (0 <= x && x < this.cols && 0 <= y && y < this.rows) {
			this[(y * this.cols) + x] = int;
		}
	}

	cutFrame (x0, y0, width, height) {

		const frame = new Uint8Array(width * height);

		let x, y;

		for (y = 0; y < height; y++) {
			for (x = 0; x < width; x++) {

				frame[(y * width) + x] = this[((y + y0) * width) + (x + x0)];
			}
		}

		return frame;
	}

	applyFrame (frame, x0, y0, fx0 = 0, fy0 = 0, fwidth = frame.cols, fheight = frame.rows) {

		if (fx0 < 0 || fy0 < 0)
			throw new Error("..."); // <<<

		if (fwidth + fx0 > frame.cols) {

			fwidth = frame.cols - fx0;

		} else if (fwidth + x0 > this.cols) {

			fwidth = this.cols - x0;
		}

		if (fheight + fy0 > frame.rows) {

			fheight = frame.rows - fy0;

		} else if (fheight + y0 > this.rows) {

			fheight = this.rows - y0;
		}

		if (x0 < 0) {

			if (-x0 < fwidth) {

				fx0 += -x0;
				fwidth -= -x0;
				x0 = 0;

			} else
				return;

		} else if (x0 > this.cols)
			return;

		if (y0 < 0) {

			if (-y0 < fheight) {

				fy0 += -y0;
				fheight -= -y0;
				y0 = 0;

			} else
				return;
		} else if (y0 > this.rows)
			return;

		let x, y;

		for (y = 0; y < fheight; y++) {
			for (x = 0; x < fwidth; x++) {

				this[((y + y0) * this.cols) + (x + x0)] = frame[((y + fy0) * frame.cols) + (x + fx0)];
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

	toImageData (palette) {

		const imd = new ImageData(this.cols, this.rows);
		const data = imd.data;

		for (let i = 0; i < this.length; i++) {

			data[   i * 4   ] = palette[this[i]][0];
			data[(i * 4) + 1] = palette[this[i]][1];
			data[(i * 4) + 2] = palette[this[i]][2];
			data[(i * 4) + 3] = 255;
		}

		return imd;
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