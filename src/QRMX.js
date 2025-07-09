"use strict";

import {Uint8ArrayX2, Bath, isFunction, Rect8} from "../tiny-usefuls.js";

import QR from "./qr.js";

const palette = [
	[255, 255, 255, 255],
	[0, 0, 0, 255],
	[255, 80, 80, 255],
	[255, 0, 0, 255],
	[120, 0, 255, 255],
	[200, 80, 255, 255]
];

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

class BrushSprite {

	static XOR (mx, dx = 0, dy = 0) {



		if (Math.abs(dx) >= mx.w || Math.abs(dy) >= mx.h || !dx || !dy)
			return new Uint8ArrayX2(mx);

		const xmx = new Uint8ArrayX2(tmx.rows + 1, tmx.columns + 1);

		let x, y;

		for (x = 0; x < mx.w; x++) {
			for (y = 0; y < mx.h; y++) {

				const c = mx.x2get(x, y) ^ (mx.x2get(x + dx, y + dy) ?? 0);

				xmx.x2set(x + 1, 0, c);
				xmx.x2set(0, y + 1, c);
				xmx.x2set(x + 1, y + 1, c);
			}
		}

		for (x = 1; xmx.x2get(x, 0) === 0; x++);
		for (y = 1; xmx.x2get(0, y) === 0; y++);
		
		const x_ = x, y_ = y;

		for (x = xmx.columns - 1; xmx.x2get(x, 0) === 0; x--);
		for (y = xmx.rows - 1; xmx.x2get(0, y) === 0; y--);

		const mx_ = new Uint8ArrayX2(x - x_ + 1, y - y_ + 1);

		mx_.dx = x_;
		mx_.dy = y_;

		for (x = 0; x < mx_.columns; x++) {
			for (y = 0; y < mx_.rows; y++) {

				mx_.x2set(x, y, xmx.x2get(x + x_, y + y_));
			}
		}

		return mx_;
	}

	constructor (type, mx) {

		this[0] = new Uint8ArrayX2(mx);
		this.type = type;

		this.w = sprite.columns;
		this.h = sprite.rows;
		this.w2 = Math.floor(sprite.columns / 2);
		this.h2 = Math.floor(sprite.rows / 2);

		this[8] = BrushSprite.XOR(mx, -1,  0);
		this[7] = BrushSprite.XOR(mx, -1,  1);
		this[6] = BrushSprite.XOR(mx,  0,  1);
		this[5] = BrushSprite.XOR(mx,  1,  1);
		this[4] = BrushSprite.XOR(mx,  1,  0);
	}
}

const Sprites = {
	// circles: {
	// 	2: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			1,1,
	// 			1,1,
	// 		], 2),
	// 	),

	// 	3: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			0,1,0,
	// 			1,1,1,
	// 			0,1,0
	// 		], 3)
	// 	),

	// 	4: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			0,1,1,0,
	// 			1,1,1,1,
	// 			1,1,1,1,
	// 			0,1,1,0
	// 		], 4)
	// 	),

	// 	5: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			0,1,1,1,0,
	// 			1,1,1,1,1,
	// 			1,1,1,1,1,
	// 			1,1,1,1,1,
	// 			0,1,1,1,0
	// 		], 5)
	// 	),

	// 	6: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			0,1,1,1,1,0,
	// 			1,1,1,1,1,1,
	// 			1,1,1,1,1,1,
	// 			1,1,1,1,1,1,
	// 			1,1,1,1,1,1,
	// 			0,1,1,1,1,0
	// 		], 6)
	// 	),

	// 	7: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			0,0,1,1,1,0,0,
	// 			0,1,1,1,1,1,0,
	// 			1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,
	// 			0,1,1,1,1,1,0,
	// 			0,0,1,1,1,0,0
	// 		], 7)
	// 	),

	// 	8: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			0,0,1,1,1,1,0,0,
	// 			0,1,1,1,1,1,1,0,
	// 			1,1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,1,
	// 			0,1,1,1,1,1,1,0,
	// 			0,0,1,1,1,1,0,0
	// 		], 8)
	// 	),

	// 	9: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			0,0,0,1,1,1,0,0,0,
	// 			0,1,1,1,1,1,1,1,0,
	// 			0,1,1,1,1,1,1,1,0,
	// 			1,1,1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,1,1,
	// 			0,1,1,1,1,1,1,1,0,
	// 			0,1,1,1,1,1,1,1,0,
	// 			0,0,0,1,1,1,0,0,0
	// 		], 9)
	// 	),

	// 	10: new BrushSprite(
	// 		new Uint8ArrayX2([
	// 			0,0,0,1,1,1,1,0,0,0,
	// 			0,0,1,1,1,1,1,1,0,0,
	// 			0,1,1,1,1,1,1,1,1,0,
	// 			1,1,1,1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,1,1,1,
	// 			1,1,1,1,1,1,1,1,1,1,
	// 			0,1,1,1,1,1,1,1,1,0,
	// 			0,0,1,1,1,1,1,1,0,0,
	// 			0,0,0,1,1,1,1,0,0,0
	// 		], 10)
	// 	)
	// }
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

const maskBitCompilers = [
	(x, y) => {
		x %= 6;
		y %= 6;
		return (x + y) % 2 === 0;
	},
	(x, y) => {
		x %= 6;
		y %= 6;
		return y % 2 === 0;
	},
	(x, y) => {
		x %= 6;
		y %= 6;
		return x % 3 === 0;
	},
	(x, y) => {
		x %= 6;
		y %= 6;
		return (x + y) % 3 === 0;
	},
	(x, y) => {
		x %= 6;
		y %= 6;
		return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
	},
	(x, y) => {
		x %= 6;
		y %= 6;
		return ((x * y) % 2) + ((x * y) % 3) === 0;
	},
	(x, y) => {
		x %= 6;
		y %= 6;
		return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
	},
	(x, y) => {
		x %= 6;
		y %= 6;
		return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
	}
];

export default class QRMX {

	static createBlank (version, errorCorrection, mask) {

		const modules = (version * 4) + 17;

		const mx = new Uint8ArrayX2(modules, modules);

		let x, y, i, j;

		// dotted strips

		for (x = 7; x < modules - 7; x += 2) {
			mx.x2set(x + 1, 6, 3);
			mx.x2set(x, 6, 2);
		}

		for (y = 7; y < modules - 7; y += 2) {
			mx.x2set(6, y + 1, 3);
			mx.x2set(6, y, 2);
		}

		// align pattern

		const apin = calculateAlignPatternIntervals(version);

		i = 0;
		j = 0;

		for (y = 6; y < modules; y += apin[j++]) {
			const maxx = modules - ((y === 6) * 7);

			if ((y % (modules - 13)) === 6) {
				x = 6 + apin[i++];
			} else {
				x = 6;
			}

			for (x; x < maxx; x += apin[i++]) {
				mx.applyFrame(alignSquareFrame, x - 2, y - 2);
			}

			i = 0;
		}

		// big base squares

		mx.applyFrame(bigBaseSquareFrame, 0, 0, 1, 1);
		mx.applyFrame(bigBaseSquareFrame, modules - 8, 0, 0, 1, 8, 8);
		mx.applyFrame(bigBaseSquareFrame, 0, modules - 8, 1, 0, 8, 8);

		// one single black spot

		mx.x2set(modules - 8, 8, 3);

		// version pattern

		if (version >= 7) {

			let vbits = version << 12,
				gen = 0b1111100100101;
	
			for (let p = 0; Bath.binlen(vbits) > 12 && p < 100; p++) {
				vbits ^= gen << Bath.binlen(vbits) - 13;
			}
	
			vbits = (version << 12) + vbits;
			vbits = vbits.toString(2);
			vbits = "0".repeat(18 - vbits.length) + vbits;
	
			for (i = 0; i < 6; i++) {
				mx.x2set(modules -  9, 5 - i, parseInt(vbits[i * 3], 10) + 2);
				mx.x2set(modules - 10, 5 - i, parseInt(vbits[(i * 3) + 1], 10) + 2);
				mx.x2set(modules - 11, 5 - i, parseInt(vbits[(i * 3) + 2], 10) + 2);
	
				mx.x2set(5 - i, modules -  9, parseInt(vbits[i * 3], 10) + 2);
				mx.x2set(5 - i, modules - 10, parseInt(vbits[(i * 3) + 1], 10) + 2);
				mx.x2set(5 - i, modules - 11, parseInt(vbits[(i * 3) + 2], 10) + 2);
			}
		}

		// return

		return new QRMX(mx, mask);
	}

	static createFromTQRT3 (mx8) {

		// 01110100 01110001 01110010 01110100 00000001 00000011 vvvvvvcc cccccccc cccccccc cccccccc cccccccc ...
		const version = mx8[0] >> 2;
		const modules = (version * 4) + 17;

		const mx = new Uint8Array(modules * modules);

		const modules8 = 8 * modules;

		const errorCorrectionDepth = ((data[modules8] % 2) << 1) + (data[modules8 + 1] % 2);
		const mask = ((data[modules8 + 2] % 2) << 2) + ((data[modules8 + 3] % 2) << 1) + (data[modules8 + 4] % 2);

		return new QRMX(mx, errorCorrectionDepth, mask);
	}

	constructor (matrix, mask) {

		this.matrix = matrix;

		if (matrix.columns !== matrix.rows)
			throw new Error("..."); // <<<

		this.modules = matrix.columns;

		// MASK PATTERN

		if (0 <= mask && mask < 8) {

			this.setMaskPattern(parseInt(mask, 10));
		}
	}

	updateFormatModules (mask, ecdepth) {

		if (0 > mask && mask > 8)
			throw new Error("Inapropriate mask type was put as an argument into QRt instance. Registered one is " + ecdepth + "\nOnly values from 0 to 7 are allowed!")

		if (0 > ecdepth && ecdepth > 4)
			throw new Error("Inapropriate error correction value was put as an argument into QRt instance. Registered one is " + ecdepth + "\nOnly values from 0 to 3 are allowed!")

		let bits = (ecdepth << 3) + mask;

		bits <<= 10;

		let _num = bits;

		for (let p = 0; Bath.binlen(bits) > 10 && p < 100; p++) {
			bits ^= 0b10100110111 << (bits.toString(2).length - 11);
		}


		bits += _num;
		bits ^= 0b101010000010010;

		// 0
		this.matrix.x2set(8, 0, (bits % 2) + 2);
		this.matrix.x2set(this.modules - 1, 8, (bits % 2) + 2);
		// 1
		bits >>= 1;
		this.matrix.x2set(8, 1, (bits % 2) + 2);
		this.matrix.x2set(this.modules - 2, 8, (bits % 2) + 2);
		// 2
		bits >>= 1;
		this.matrix.x2set(8, 2, (bits % 2) + 2);
		this.matrix.x2set(this.modules - 3, 8, (bits % 2) + 2);
		// 3
		bits >>= 1;
		this.matrix.x2set(8, 3, (bits % 2) + 2);
		this.matrix.x2set(this.modules - 4, 8, (bits % 2) + 2);
		// 4
		bits >>= 1;
		this.matrix.x2set(8, 4, (bits % 2) + 2);
		this.matrix.x2set(this.modules - 5, 8, (bits % 2) + 2);
		// 5
		bits >>= 1;
		this.matrix.x2set(8, 5, (bits % 2) + 2);
		this.matrix.x2set(this.modules - 6, 8, (bits % 2) + 2);
		// 6
		bits >>= 1;
		this.matrix.x2set(8, 7, (bits % 2) + 2);
		this.matrix.x2set(this.modules - 7, 8, (bits % 2) + 2);
		// 7
		bits >>= 1;
		this.matrix.x2set(8, 8, (bits % 2) + 2);
		this.matrix.x2set(this.modules - 8, 8, (bits % 2) + 2);
		// 8
		bits >>= 1;
		this.matrix.x2set(7, 8, (bits % 2) + 2);
		this.matrix.x2set(8, this.modules - 7, (bits % 2) + 2);
		// 9
		bits >>= 1;
		this.matrix.x2set(5, 8, (bits % 2) + 2);
		this.matrix.x2set(8, this.modules - 6, (bits % 2) + 2);
		// 10
		bits >>= 1;
		this.matrix.x2set(4, 8, (bits % 2) + 2);
		this.matrix.x2set(8, this.modules - 5, (bits % 2) + 2);
		// 11
		bits >>= 1;
		this.matrix.x2set(3, 8, (bits % 2) + 2);
		this.matrix.x2set(8, this.modules - 4, (bits % 2) + 2);
		// 12
		bits >>= 1;
		this.matrix.x2set(2, 8, (bits % 2) + 2);
		this.matrix.x2set(8, this.modules - 3, (bits % 2) + 2);
		// 13
		bits >>= 1;
		this.matrix.x2set(1, 8, (bits % 2) + 2);
		this.matrix.x2set(8, this.modules - 2, (bits % 2) + 2);
		// 14
		bits >>= 1;
		this.matrix.x2set(0, 8, (bits % 2) + 2);
		this.matrix.x2set(8, this.modules - 1, (bits % 2) + 2);
	}

	getCell (x, y) {

		return this.matrix[(y * this.modules) + x];
	}

	setCell (value, x, y) {

		this.matrix[(y * this.modules) + x] = value;
	}

	setMaskPattern (value) { // SEPARATE

		this.maskPattern = maskBitCompilers[parseInt(value, 10)];
	}

	// drawing - drawing - drawing - drawing - drawing - drawing - drawing - drawing - drawing

	applyPointOn (x, y, c) {
		if (this.matrix.x2get(x, y) < 2) {
			this.matrix.x2set(x, y, c);
		}
	}

	drawPointOn (canvas, x, y, c) {
		if (this.matrix.x2get(x, y) < 2) {
			QR.ctx.fillStyle = QR.palette[c];
			QR.ctx.fillRect(x, y, 1, 1);
		}
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

	drawSpriteOn (canvas, x, y, brush, c) { // DONE
		if (brush instanceof BrushSprite) {
			QR.ctx.fillStyle = QR.palette[c];

			for (let i = 0; i < brush.width; i++) {
				for (let j = 0; j < brush.height; j++) {
					if (brush.sprite.x2get(i, j) === 1 && this.matrix.x2get(i + x - brush.width2, y + j - brush.height2) < 2) {
						QR.ctx.fillRect(i + x - brush.width2, j + y - brush.height2, 1, 1);
					}
				}
			}

			return new Rect8(x - brush.width2, y - brush.height2, x + brush.width - brush.width2, y + brush.height - brush.height2);

		} else throw new Error("..."); // <<<
	}

	applyLineOn (x0, y0, x, y, c, brush) {
		let dx = (x - x0), dy = (y - y0);

		const rect = new Rect8(x0, y0, x, y);

		let apply;

		if (brush instanceof BrushSprite) {
			this.applySpriteOn(x0, y0, brush, c);

			rect[0] -= brush.width2;
			rect[1] -= brush.height2;
			rect[2] += brush.width2 - ((brush.width % 2) ^ 1);
			rect[3] += brush.height2 - ((brush.height % 2) ^ 1);

			if (dx === 0 && dy === 0) return rect;

			const _bw = Math.abs(((dy || 1) / dx) * brush.height);
			const _bh = Math.abs(brush.width / ((dy || 1) / dx));

			let bw, bh, bx, by;

			if (_bw / brush.width < _bh / brush.height) {
				if (dx > 0) {
					bw = brush.width;
					bx = Math.floor((brush.width - _bw) / 2);
				} else {
					bw = Math.ceil((brush.width + _bw) / 2);
					bx = 0;
				}

				bh = brush.height;
				by = 0;
			} else {
				if (dy > 0) {
					bh = brush.height;
					by = Math.floor((brush.height - _bh) / 2);
				} else {
					bh = Math.ceil((brush.height + _bh) / 2);
					by = 0;
				}

				bw = brush.width;
				bx = 0;
			}

			apply = (x, y) => {
				for (let i = bx; i < bw; i++) {
					for (let j = by; j < bh; j++) {
						if (brush.fastsprite.x2get(i, j) === 1 &&
							this.matrix.x2getD(x - brush.width2 + i, y - brush.height2 + j, 2) < 2
						) {
							this.matrix.x2set(x - brush.width2 + i, y - brush.height2 + j, c);
						}
					}
				}
			};
		} else {
			this.applyPointOn(x0, y0, c);

			if (dx === 0 && dy === 0) return rect;

			apply = (x, y) => {
				if (this.matrix.x2get(x, y) < 2) {
					this.matrix.x2set(x, y, c);
				}
			};
		}

		if (Math.abs(dx) < Math.abs(dy)) {
			if (dy < 0) {
				x = -dx;
				y = -dy;
				x0 += dx;
				y0 += dy;
				dx = -dx;
				dy = -dy;
			}

			const k = dx / dy;
			for (y = 0; y <= dy; y++) {
				apply(Math.round(y * k) + x0, y + y0);
			}
		} else {
			if (dx < 0) {
				x = -dx;
				y = -dy;
				x0 += dx;
				y0 += dy;
				dx = -dx;
				dy = -dy;
			}

			const k = dy / dx;
			for (x = 0; x <= dx; x++) {
				apply(x + x0, Math.round(x * k) + y0);
			}
		}

		return rect;
	}

	drawLineOn (canvas, x0, y0, x, y, c, brush) { // DONE
		let dx = (x - x0), dy = (y - y0);

		QR.ctx.fillStyle = QR.palette[c];

		const rect = new Rect8(x0, y0, x, y);

		let apply;

		if (brush instanceof BrushSprite) {
			this.drawSpriteOn(x0, y0, brush, c);

			rect[0] -= brush.width2;
			rect[1] -= brush.height2;
			rect[2] += brush.width2 - ((brush.width % 2) ^ 1);
			rect[3] += brush.height2 - ((brush.height % 2) ^ 1);

			if (dx === 0 && dy === 0) return rect;

			const _bw = Math.abs(((dy || 1) / dx) * brush.height);
			const _bh = Math.abs(brush.width / ((dy || 1) / dx));

			let bw, bh, bx, by;

			if (_bw / brush.width < _bh / brush.height) {
				if (dx > 0) {
					bw = brush.width;
					bx = Math.floor((brush.width - _bw) / 2);
				} else {
					bw = Math.ceil((brush.width + _bw) / 2);
					bx = 0;
				}

				bh = brush.height;
				by = 0;
			} else {
				if (dy > 0) {
					bh = brush.height;
					by = Math.floor((brush.height - _bh) / 2);
				} else {
					bh = Math.ceil((brush.height + _bh) / 2);
					by = 0;
				}

				bw = brush.width;
				bx = 0;
			}

			apply = (x, y) => {
				for (let i = bx; i < bw; i++) {
					for (let j = by; j < bh; j++) {
						if (brush.fastsprite.x2get(i, j) === 1 &&
							this.matrix.x2getD(x - brush.width2 + i, y - brush.height2 + j, 2) < 2
						) {
							QR.ctx.fillRect(x - brush.width2 + i, y - brush.height2 + j, 1, 1);
						}
					}
				}
			};
		} else {
			this.drawPointOn(x0, y0, c);

			if (dx === 0 && dy === 0) return rect;

			apply = (x, y) => {
				if (this.matrix.x2get(x, y) < 2) {
					QR.ctx.fillRect(x, y, 1, 1);
				}
			};
		}

		if (Math.abs(dx) < Math.abs(dy)) {
			if (dy < 0) {
				x = -dx;
				y = -dy;
				x0 += dx;
				y0 += dy;
				dx = -dx;
				dy = -dy;
			}

			const k = dx / dy;
			for (y = 0; y <= dy; y++) {
				apply(Math.round(y * k) + x0, y + y0);
			}
		} else {
			if (dx < 0) {
				x = -dx;
				y = -dy;
				x0 += dx;
				y0 += dy;
				dx = -dx;
				dy = -dy;
			}

			const k = dy / dx;
			for (x = 0; x <= dx; x++) {
				apply(x + x0, Math.round(x * k) + y0);
			}
		}

		return rect;
	}

	applyEllipseOn (x0, y0, x, y, center = false, circle = false, c = 1) {
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		const rect = center ? new Rect8(x0 - a, y0 - b, x0 + a, y0 + b) : new Rect8(x0, y0, x, y);

		if (circle) {
			a = Math.max(a, b);
			b = a;
		} else {
			if (a % (3 - center) === a) {
				QR.ctx.fillRect(rect[0] + center, rect[1], a % 3, (b * (1 + center)) + center);
				return rect;
			} else if (b % (3 - center) === b) {
				QR.ctx.fillRect(rect[0], rect[1] + center, (a * (1 + center)) + center, b % 3);
				return rect;
			}
		}

		let _x, _y;

		let da = 0,
			db = 0;

		if (!center) {
			if (x0 > x) {
				x0 -= a;
				x = x0 + a;
				x0++;
				x++;
			}

			if (y0 > y) {
				y0 -= b;
				y = y0 + b;
				y0++;
				y++;
			}

			a = (a - 1) / 2;
			b = (b - 1) / 2;
			da = -(a % 1);
			db = -(b % 1);
			x0 += a - da;
			y0 += b - db;
		}

		rect[0] = x0 - a + da;
		rect[1] = y0 - b + db;
		rect[2] = x0 + a + da;
		rect[3] = y0 + b + db;

		for (y = -b; y <= b; y++) {
			x = Math.sqrt((a ** 2) - ((a * y / b) ** 2));
			_x = -Math.round(x - da) + x0;
			x = Math.round(x + da) + x0;
			_y = y + db + y0;

			if (this.matrix.x2getD(x, _y, 2) < 2) {
				this.matrix.x2set(x, _y, c);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				this.matrix.x2set(_x, _y, c);
			}
		}

		for (x = -a; x <= a; x++) {
			y = Math.sqrt((b ** 2) - ((b * x / a) ** 2));
			_y = -Math.round(y - db) + y0;
			y = Math.round(y + db) + y0;
			_x = x + da + x0;

			if (this.matrix.x2getD(_x, y, 2) < 2) {
				this.matrix.x2set(_x, y, c);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				this.matrix.x2set(_x, _y, c);
			}
		}

		return rect;
	}

	drawEllipseOn (canvas, x0, y0, x, y, center = false, circle = false, c = 1) {
		let a = Math.abs(x - x0) + 1,
			b = Math.abs(y - y0) + 1;

		QR.ctx.fillStyle = QR.palette[c];

		const rect = center ? new Rect8(x0 - a, y0 - b, x0 + a, y0 + b) : new Rect8(x0, y0, x, y);

		if (circle) {
			a = Math.max(a, b);
			b = a;
		} else {
			if (a % (3 - center) === a) {
				QR.ctx.fillRect(rect[0] + center, rect[1], a % 3, ((rect[3] - rect[1]) * (1 + center)) + center);
				return rect;
			} else if (b % (3 - center) === b) {
				QR.ctx.fillRect(rect[0], rect[1] + center, ((rect[2] - rect[0]) * (1 + center)) + center, b % 3);
				return rect;
			}
		}

		let _x, _y;

		let da = 0,
			db = 0;

		if (!center) {
			if (x0 > x) {
				x0 -= a;
				x = x0 + a;
				x0++;
				x++;
			}

			if (y0 > y) {
				y0 -= b;
				y = y0 + b;
				y0++;
				y++;
			}

			a = (a - 1) / 2;
			b = (b - 1) / 2;
			da = -(a % 1);
			db = -(b % 1);
			x0 += a - da;
			y0 += b - db;
		}

		rect[0] = x0 - a + da;
		rect[1] = y0 - b + db;
		rect[2] = x0 + a + da;
		rect[3] = y0 + b + db;

		for (y = -b; y <= b; y++) {
			x = Math.sqrt((a ** 2) - ((a * y / b) ** 2));
			_x = -Math.round(x - da) + x0;
			x = Math.round(x + da) + x0;
			_y = y + db + y0;

			if (this.matrix.x2getD(x, _y, 2) < 2) {
				QR.ctx.fillRect(x, _y, 1, 1);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				QR.ctx.fillRect(_x, _y, 1, 1);
			}
		}

		for (x = -a; x <= a; x++) {
			y = Math.sqrt((b ** 2) - ((b * x / a) ** 2));
			_y = -Math.round(y - db) + y0;
			y = Math.round(y + db) + y0;
			_x = x + da + x0;

			if (this.matrix.x2getD(_x, y, 2) < 2) {
				QR.ctx.fillRect(_x, y, 1, 1);
			}

			if (this.matrix.x2getD(_x, _y, 2) < 2) {
				QR.ctx.fillRect(_x, _y, 1, 1);
			}
		}

		return rect;
	}

	// data application - data application - data application - data application - data application

	DEV_toImageData (x0 = 0, y0 = 0, width = this.modules - x0, height = this.modules - y0) {

		const imd = new ImageData(width, height);
		const imx = imd.data;

		if (x0 < 0 || y0 < 0 || width + x0 > this.modules || height + y0 > this.modules)
			throw new Error("..."); // <<<

		let i, j, c = 0;

		for (i = 0; i < this.modules; i++) {
			for (j = 0; j < this.modules; j++) {

				const color = palette[this.matrix.x2get(i, j)];

				imx[  c  ] = color[0];
				imx[c + 1] = color[1];
				imx[c + 2] = color[2];
				imx[c + 3] = color[3];

				c += 4;
			}
		}

		return imd;
	}

	toImageData (x0 = 0, y0 = 0, width = this.modules - x0, height = this.modules - y0) {

		const imd = new ImageData(width, height);
		const imx = imd.data;

		if (x0 < 0 || y0 < 0 || width + x0 > this.modules || height + y0 > this.modules)
			throw new Error("..."); // <<<

		let i, j, c = 0;

		for (i = 0; i < this.modules; i++) {
			for (j = 0; j < this.modules; j++) {

				const color = palette[this.matrix.x2get(i, j) % 2];

				imx[  c  ] = color[0];
				imx[c + 1] = color[1];
				imx[c + 2] = color[2];
				imx[c + 3] = color[3];

				c += 4;
			}
		}

		return imd;
	}

	goThroughDataModules (j, maxj, act) {

		if (!isFunction(act)) throw new Error("Inappropriate value of act arg. was put into goThroughDataModules method!");

		let x = this.modules - 1,
			y = this.modules - 1,
			v = ((Math.floor(x / 2) % 2) * 2) - 1;

		while (j < maxj || x >= 0) {

			const c = this.matrix.x2get(x, y);

			if (c % 4 < 2)
				act({x, y, j: j++, c, v});

			if (x % 2) {
				y -= v;
				x++;

				if (y === -1 || y === this.modules) {
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
}