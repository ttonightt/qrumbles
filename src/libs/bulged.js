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

const step = 1;

const I = 50;
const Ox = 50;
const Oy = 50;
const Ox2 = Ox * 2;
const Oy2 = Oy * 2;

const reflect = (p, xf, yf) => Object.assign({}, p, {

	x0: xf ? Ox2 - p.x0 : p.x0,
	y0: yf ? Oy2 - p.y0 : p.y0
});

const r = n => Math.round(n * 100) / 100;

export const generateBulged = (bx, by, roundness) => {

	bx /= 100;
	by /= 100;
	const Rr = roundness * I / 100;

	const Rx = I / bx;
	const Ry = I / by;

	const cics = [
		{x0: Ox - Rx + I, 	y0: Oy,				R: Rx}, // >
		{x0: Ox, 			y0: Oy - Ry + I,	R: Ry}, // v
		{x0: Ox + Rx - I, 	y0: Oy,				R: Rx}, // <
		{x0: Ox, 			y0: Oy + Ry - I,	R: Ry}  // ^
	];

	const cicx = Object.assign({}, cics[0]);
	const cicy = Object.assign({}, cics[1]);

	cicx.R -= Rr;
	cicy.R -= Rr;

	const arcs = [];

	arcs[0] = {...CC(cicx, cicy)[1], R: Rr};
	arcs[1] = reflect(arcs[0], 1, 0);
	arcs[2] = reflect(arcs[0], 1, 1);
	arcs[3] = reflect(arcs[0], 0, 1);

	const points = [];

	points[0] = CC0(cics[0], arcs[0]);
	points[1] = CC0(cics[1], arcs[0]);

	points[2] = reflect(points[1], 1, 0);
	points[3] = reflect(points[0], 1, 0);

	points[4] = reflect(points[0], 1, 1);
	points[5] = reflect(points[1], 1, 1);

	points[6] = reflect(points[1], 0, 1);
	points[7] = reflect(points[0], 0, 1);

	const switcher = CL(arcs[0], Line(arcs[0], CC(cics[0], cics[1])[1]))[0];

	let polygon = "";

	for (let x = Ox + I; x > points[0].x0; x -= step) {

		polygon += r(x) + "," + r(CLx(cics[0], x)[0]) + " ";
	}

	for (let x = points[0].x0; x > switcher.x0; x -= step) {

		polygon += r(x) + "," + r(CLx(arcs[0], x)[0]) + " ";
	}

	for (let y = switcher.y0; y < points[1].y0; y += step) {

		polygon += r(CLy(arcs[0], y)[0]) + "," + r(y) + " ";
	}

	for (let y = points[1].y0; y < Oy + I; y += step) {

		polygon += r(CLy(cics[1], y)[0]) + "," + r(y) + " ";
	}

	for (let y = Oy + I; y > points[2].y0; y -= step) {

		polygon += r(CLy(cics[1], y)[1]) + "," + r(y) + " ";
	}

	for (let y = points[2].y0; y > switcher.y0; y -= step) {

		polygon += r(CLy(arcs[1], y)[1]) + "," + r(y) + " ";
	}

	for (let x = Ox2 - switcher.x0; x > points[3].x0; x -= step) {

		polygon += r(x) + "," + r(CLx(arcs[1], x)[0]) + " ";
	}

	for (let x = points[3].x0; x > Ox - I; x -= step) {

		polygon += r(x) + "," + r(CLx(cics[2], x)[0]) + " ";
	}

	for (let x = Ox - I; x < points[4].x0; x += step) {

		polygon += r(x) + "," + r(CLx(cics[2], x)[1]) + " ";
	}

	for (let x = points[4].x0; x < Ox2 - switcher.x0; x += step) {

		polygon += r(x) + "," + r(CLx(arcs[2], x)[1]) + " ";
	}

	for (let y = Oy2 - switcher.y0; y > points[5].y0; y -= step) {

		polygon += r(CLy(arcs[2], y)[1]) + "," + r(y) + " ";
	}

	for (let y = points[5].y0; y > Oy - I; y -= step) {

		polygon += r(CLy(cics[3], y)[1]) + "," + r(y) + " ";
	}

	for (let y = Oy - I; y < points[6].y0; y += step) {

		polygon += r(CLy(cics[3], y)[0]) + "," + r(y) + " ";
	}

	for (let y = points[6].y0; y < Oy2 - switcher.y0; y += step) {

		polygon += r(CLy(arcs[3], y)[0]) + "," + r(y) + " ";
	}

	for (let x = switcher.x0; x < points[7].x0; x += step) {

		polygon += r(x) + "," + r(CLx(arcs[3], x)[1]) + " ";
	}

	for (let x = points[7].x0; x < Ox + I; x += step) {

		polygon += r(x) + "," + r(CLx(cics[0], x)[1]) + " ";
	}

	return {
		polygon,
		path: `
							  M ${points[0].x0} ${points[0].y0}
			A ${Rr} ${Rr} 0 0 1 ${points[1].x0} ${points[1].y0}
			A ${Ry} ${Ry} 0 0 1 ${points[2].x0} ${points[2].y0}
			A ${Rr} ${Rr} 0 0 1 ${points[3].x0} ${points[3].y0}
			A ${Rx} ${Rx} 0 0 1 ${points[4].x0} ${points[4].y0}
			A ${Rr} ${Rr} 0 0 1 ${points[5].x0} ${points[5].y0}
			A ${Ry} ${Ry} 0 0 1 ${points[6].x0} ${points[6].y0}
			A ${Rr} ${Rr} 0 0 1 ${points[7].x0} ${points[7].y0}
			A ${Rx} ${Rx} 0 0 1 ${points[0].x0} ${points[0].y0}
		`
	};
};