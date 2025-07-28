export class Rect8 {

	static wh (x0, y0, w, h) {

		return new Rect8(x0, y0, x0 + w, y0 + h);
	}

	static xy (x0, y0, x, y) {

		return new Rect8(x0, y0, x, y);
	}

	static intersect (target, source) {

		if (
			source.x0 > target.x || source.y0 > target.y ||
			target.x0 > source.x || target.y0 > source.y
		)
			return null;

		return new Rect8(
			Math.max(target.x0, source.x0),
			Math.max(target.y0, source.y0),
			Math.min(target.x, source.x),
			Math.min(target.y, source.y)
		);
	}

	constructor (x0, y0, x, y, outset = 0) {
		if (typeof x0 === "number" && typeof y0 === "number" && typeof x === "number" && typeof y === "number" && typeof outset === "number") {

			if (x0 > x) {
				this.x0 = x - outset;
				this.x = x0 + outset;
			} else {
				this.x0 = x0 - outset;
				this.x = x + outset;
			}

			if (y0 > y) {
				this.y0 = y - outset;
				this.y = y0 + outset;
			} else {
				this.y0 = y0 - outset;
				this.y = y + outset;
			}

			this.w = this.x - this.x0;
			this.h = this.y - this.y0;
		} else return false;
	}

	copy () {

		return new Rect8(this.x0, this.y0, this.x, this.y);
	}

	translate (dx, dy) {

		if (typeof dx !== "number" || typeof dy !== "number") throw new Error("...");

		this.x0 += dx;
		this.y0 += dy;

		return this;
	}
}