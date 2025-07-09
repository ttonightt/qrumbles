const CC = (cic1, cic2) => {

	const dx = cic2.x0 - cic1.x0;
	const dy = cic2.y0 - cic1.y0;
	const d2 = dx * dx + dy * dy;
	const R12 = cic1.R * cic1.R;
	const R22 = cic2.R * cic2.R;

	const k = (R12 - R22 + d2) / (2 * d2);
	const D = Math.sqrt((R12 * d2) - (((R12 - R22 + d2) ** 2) / 4));

	return [
		{
			x0: cic1.x0 + (k * dx) + (dy * (D / d2)),
			y0: cic1.y0 + (k * dy) - (dx * (D / d2))
		},
		{
			x0: cic1.x0 + (k * dx) - (dy * (D / d2)),
			y0: cic1.y0 + (k * dy) + (dx * (D / d2))
		}
	];
};

const CC0 = (cic1, cic2) => {

	const dx = cic2.x0 - cic1.x0;
	const dy = cic2.y0 - cic1.y0;
	const d2 = dx * dx + dy * dy;
	const R12 = cic1.R * cic1.R;
	const R22 = cic2.R * cic2.R;

	const k = (R12 - R22 + d2) / (2 * d2);
	const D = 0;

	return {
		x0: cic1.x0 + (k * dx) + (dy * (D / d2)),
		y0: cic1.y0 + (k * dy) - (dx * (D / d2))
	};
};

const Line = (p1, p2) => {

	const k = (p2.y0 - p1.y0) / (p2.x0 - p1.x0);
	const p = p1.y0 - (p1.x0 * k);

	return {
		k,
		p
	};
};

const CL = (arc, line) => {

	const py = line.p - arc.y0;
	const a = (line.k * line.k) + 1;
	const b = 2 * ((line.k * py) - arc.x0);
	const c = (arc.x0 * arc.x0) - (arc.R*arc.R) + (py*py);
	const D = Math.sqrt((b*b) - (4 * a * c));

	const nx1 = ((-1 * b) + D) / (2 * a);
	const nx2 = ((-1 * b) - D) / (2 * a);

	return [
		{
			x0: nx1,
			y0: (line.k * nx1) + line.p
		},
		{
			x0: nx2,
			y0: (line.k * nx2) + line.p
		}
	];
};

const CLx = (arc, x) => {

	const dx2 = (x - arc.x0)**2;
	const b = -2 * arc.y0;
	const c = (arc.y0 * arc.y0) - (arc.R*arc.R) + dx2;
	const D = Math.sqrt(
		Math.round(
			((b*b) - (4 * c)) * 100
		) / 100
	);

	return [
		(-b + D) / 2,
		(-b - D) / 2
	];
};

const CLy = (arc, y) => {

	const dy2 = (y - arc.y0)**2;
	const b = -2 * arc.x0;
	const c = (arc.x0 * arc.x0) - (arc.R*arc.R) + dy2;
	const D = Math.sqrt(
		Math.round(
			((b*b) - (4 * c)) * 100
		) / 100
	);

	return [
		(-b + D) / 2,
		(-b - D) / 2
	];
};

const I = 50; // CANT BE CHANGED!!!
const Ox = 50; // CANT BE CHANGED!!!
const Oy = 50; // CANT BE CHANGED!!!
const Ox2 = Ox * 2;
const Oy2 = Oy * 2;

const reflect = (p, xf, yf) => Object.assign({}, p, {

	x0: xf ? Ox2 - p.x0 : p.x0,
	y0: yf ? Oy2 - p.y0 : p.y0
});

const reflectX = x => Ox2 - x;
const reflectY = y => Oy2 - y;

const r = n => Math.round(n * 10) / 10;

export const generateBulged = (bx, by, roundness) => {

	const Rr = roundness * I;

	const Rx = I / bx;
	const Ry = I / by;

	const cicx0 = {x0: Ox + Rx - I, y0: Oy,				R: Rx};
	const cicy0 = {x0: Ox, 			y0: Oy + Ry - I,	R: Ry};

	const cicx = Object.assign({}, cicx0);
	const cicy = Object.assign({}, cicy0);

	cicx.R -= Rr;
	cicy.R -= Rr;

	const arc = {...CC(cicx, cicy)[1], R: Rr};

	const points = [];

	points[0] = CC0(cicx0, arc);
	points[1] = CC0(cicy0, arc);

	return {
		Ox,
		Oy,
		I,
		toClipPolygon: (step, Xp_a, Yp_a) => {

			if (typeof step !== "number" || step <= 0) throw new Error("...");

			if (typeof Xp_a !== "number" || Xp_a < 0 || Xp_a > 1) throw new Error("...");
			if (typeof Yp_a !== "number" || Yp_a < 0 || Yp_a > 1) throw new Error("...");

			const xp = Xp_a;
			const xa = 1 - Xp_a;
			const yp = Yp_a;
			const ya = 1 - Yp_a;

			const switcher = CL(arc, Line(arc, CC(cicx0, cicy0)[1]))[1];

			const pxs1 = [], pys1 = [];
			const pxs2 = [], pys2 = [];
			
			const mx = 0, my = 0;

			for (let x = mx; x < points[0].x0; x += step) {

				pxs1.push(x);
				pys1.push(CLx(cicx0, x)[1]);
			}

			for (let x = points[0].x0; x < switcher.x0; x += step) {

				pxs1.push(x);
				pys1.push(CLx(arc, x)[1]);
			}

			for (let y = my; y < points[1].y0; y += step) {

				pxs2.push(CLy(cicy0, y)[1]);
				pys2.push(y);
			}

			for (let y = points[1].y0; y < switcher.y0; y += step) {

				pxs2.push(CLy(arc, y)[1]);
				pys2.push(y);
			}

			pxs2.push(CLy(arc, switcher.y0)[1]);
			pys2.push(switcher.y0);

			pxs2.reverse();
			pys2.reverse();

			const pxs = pxs1.concat(pxs2);
			const pys = pys1.concat(pys2);

			//

			let clipPath = "polygon(";

			for (let i = 0; i < pxs.length; i++) {

				clipPath += `calc(${r(
					xp * pxs[i]
				)}% + ${r(
					xa * pxs[i]
				)}px) calc(${r(
					yp * pys[i]
				)}% + ${r(
					ya * pys[i]
				)}px),`;
			}

			for (let i = pxs.length - 1; i >= 0; i--) {

				clipPath += `calc(${r(
					100 - (xp * pxs[i])
				)}% - ${r(
					xa * pxs[i]
				)}px) calc(${r(
					yp * pys[i]
				)}% + ${r(
					ya * pys[i]
				)}px),`;
			}

			for (let i = 0; i < pxs.length; i++) {

				clipPath += `calc(${r(
					100 - (xp * pxs[i])
				)}% - ${r(
					xa * pxs[i]
				)}px) calc(${r(
					100 - (yp * pys[i])
				)}% - ${r(
					ya * pys[i]
				)}px),`;
			}

			for (let i = pxs.length - 1; i >= 0; i--) {

				clipPath += `calc(${r(
					xp * pxs[i]
				)}% + ${r(
					xa * pxs[i]
				)}px) calc(${r(
					100 - (yp * pys[i])
				)}% - ${r(
					ya * pys[i]
				)}px),`;
			}

			clipPath = clipPath.slice(0, -1) + ")";

			return clipPath;
		},

		toPath: () => `
							  M ${			points[0].x0} ${		  points[0].y0}
			A ${Rr} ${Rr} 0 0 1 ${			points[1].x0} ${		  points[1].y0}
			A ${Ry} ${Ry} 0 0 1 ${reflectX(points[1].x0)} ${		  points[1].y0}
			A ${Rr} ${Rr} 0 0 1 ${reflectX(points[0].x0)} ${		  points[0].y0}
			A ${Rx} ${Rx} 0 0 1 ${reflectX(points[0].x0)} ${reflectY(points[0].y0)}
			A ${Rr} ${Rr} 0 0 1 ${reflectX(points[1].x0)} ${reflectY(points[1].y0)}
			A ${Ry} ${Ry} 0 0 1 ${			points[1].x0} ${reflectY(points[1].y0)}
			A ${Rr} ${Rr} 0 0 1 ${			points[0].x0} ${reflectY(points[0].y0)}
			A ${Rx} ${Rx} 0 0 1 ${			points[0].x0} ${		  points[0].y0}
		`
	};
};