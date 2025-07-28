export class BrushSprite {

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