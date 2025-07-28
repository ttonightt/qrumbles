import { Uint8ArrayX2 } from "./libs/Uint8ArrayX2";
import { isFunction } from "./libs/isFunction";
import { CSSNamedColors } from "./libs/CSSNamedColors";


const calculateAlignPatternIntervals = version => {

	const sbss = new Uint8Array(Math.floor(version / 7) + 1);

	const modules = (version * 4) + 17;

	let i;

	const inter = (modules - 13) / sbss.length;

	if (inter === Math.floor(inter / 2) * 2) {
		for (i = 0; i < sbss.length; i++) {
			sbss[i] = inter;
		}
	} else {
		let inter0 = inter;
		sbss[1] = Math.ceil(Math.round(inter) / 2) * 2;

		for (i = 1; i < sbss.length; i++) {
			sbss[i] = sbss[1];
			inter0 -= (sbss[1] - inter);
		}

		sbss[0] = Math.round(inter0);
	}

	return sbss;
};



const bigBaseSquareFrame = new Uint8ArrayX2([
	2,2,2,2,2,2,2,2,2,
	2,3,3,3,3,3,3,3,2,
	2,3,2,2,2,2,2,3,2,
	2,3,2,3,3,3,2,3,2,
	2,3,2,3,3,3,2,3,2,
	2,3,2,3,3,3,2,3,2,
	2,3,2,2,2,2,2,3,2,
	2,3,3,3,3,3,3,3,2,
	2,2,2,2,2,2,2,2,2
], 9);

const alignSquareFrame = new Uint8ArrayX2([
	3,3,3,3,3,
	3,2,2,2,3,
	3,2,3,2,3,
	3,2,2,2,3,
	3,3,3,3,3
], 5);

export class QRMX {

	constructor (version) {

		this.version = version;
		this.size = version * 4 + 17;
		this.mx = new Uint8ArrayX2(this.size, this.size);

		let x, y, i, j;

		// dotted strips

		for (x = 7; x < this.size - 7; x += 2) {
			this.mx.x2set(x + 1, 6, 3);
			this.mx.x2set(x, 6, 2);
		}

		for (y = 7; y < this.size - 7; y += 2) {
			this.mx.x2set(6, y + 1, 3);
			this.mx.x2set(6, y, 2);
		}

		// align pattern

		const alignPattern = calculateAlignPatternIntervals(version);

		i = 0;
		j = 0;

		for (y = 6; y < this.size; y += alignPattern[j++]) {
			const maxx = this.size - ((y === 6) * 7);

			if ((y % (this.size - 13)) === 6) {
				x = 6 + alignPattern[i++];
			} else {
				x = 6;
			}

			for (x; x < maxx; x += alignPattern[i++]) {
				this.mx.x2put(alignSquareFrame, x - 2, y - 2);
			}

			i = 0;
		}

		// big base squares

		this.mx.x2put(bigBaseSquareFrame, 0, 0, 1, 1);
		this.mx.x2put(bigBaseSquareFrame, this.size - 8, 0, 0, 1, 8, 8);
		this.mx.x2put(bigBaseSquareFrame, 0, this.size - 8, 1, 0, 8, 8);

		// one single black spot

		this.mx.x2set(this.size - 8, 8, 3);
	}

	applySpriteOn (x, y, brush, c) {
		if (brush instanceof BrushSprite) {
			for (let i = 0; i < brush.width; i++) {
				for (let j = 0; j < brush.height; j++) {
					if (brush.sprite.x2get(i, j) === 1 && this.matrix.x2get(i + x - brush.width2, y + j - brush.height2) < 2) {
						this.matrix.x2set(i + x - brush.width2, j + y - brush.height2, c);
					}
				}
			}
		} else throw new Error("..."); // <<<
	}

	eachDataModule (fn, ffe) {

		if (!isFunction(fn)) throw new Error("...");

		let x = this.size - 1,
			y = this.size - 1,
			v = 1,
			i = 0;

		while (i < ffe && x >= 0) {

			const c = this.mx.x2get(x, y);

			if (c % 4 < 2) {
				fn(i, x, y, c, v);
				i++;
			}

			if (x % 2) {
				y -= v;
				x++;

				if (y === -1 || y === this.size) {
					x -= 2;
					v = -v;
					y -= v;
				}
			} else {
				x--;
			}

			if (x === 6) x = 5; // IS USED BY ERROR CORRECTION CODEWORDS ONLY!!!! THE SEPARATE METHOD MUST BE ADDED!!!
		}
	}

	applyBitStream (int8, ffe) {

		this.eachDataModule((i, x, y) => {

			const byte = Math.floor(i / 8);
			const bit = i % 8;

			this.mx.x2set(x, y, (int8[byte] >> (7 - bit)) % 2);

		}, ffe);
	}

	toImageData (scale = 1, palette) {

		const mx_ = this.mx.scale(scale);

		const imd = new ImageData(mx_.cols, mx_.rows);
		const data = imd.data;

		for (let i = 0; i < mx_.length; i++) {

			data[   i * 4   ] = palette[mx_[i]][0];
			data[(i * 4) + 1] = palette[mx_[i]][1];
			data[(i * 4) + 2] = palette[mx_[i]][2];
			data[(i * 4) + 3] = 255;
		}

		return imd;
	}
}