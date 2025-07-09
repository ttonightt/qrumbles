"use strict";

import plugin from "tailwindcss/plugin";
import { generateBulged } from "./src/libs/bulged";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

export const isFunction = func => {
	return !!(func && func.constructor && func.call && func.apply);
};

const flattenObjectMatrix = (layers, i = 0, base) => {

	if (i >= 100) throw new Error("...");
	
	if ((!base || !base.length) && i === 0) {

		base = layers[0];
		i++;
	}

	const layer = layers[i];

	const separator = i ? "-" : "";
	const values = {};

	for (let kb in base) {

		for (let kl in layer) {

			values[
				kb + separator + kl
			] = [].concat(base[kb], layer[kl]);
		}
	}

	if (i >= layers.length - 1) {

		return values;
	} else {

		return flattenObjectMatrix(layers, i + 1, values);
	}
};

export const clip = plugin(({addUtilities, matchUtilities, addVariant, matchComponents, addComponents, theme, remove}) => {

	matchUtilities({
		"bulged": value => {

			if (typeof value !== "string") throw new Error("...");

			const args = value.split(/,\s*/);

			return {
				clipPath: generateBulged(args[0] / 100, args[1] / 100, args[2] / 100).toClipPolygon(0.5, args[3] / 100, args[4] / 100)
			};
		}
	}, {
		values: flattenColorPalette(theme("bulged")),
		supportsNegativeValues: false
	});
}, {
	theme: {
		bulged: {
			"none": "none",
			"x-md-md": "25, 25, 50, 15, 100",
			"x-sm-md": "15, 5, 25, 100, 100",
			"y-md-md": "20, 15, 25, 100, 100",
			"md-md": "30, 30, 25, 100, 100",
			"x-md-sm": "15, 20, 25, 60, 100",
			"y-md-sm": "25, 30, 15, 100, 100",
			"y-sm-sm": "10, 7, 9, 70, 50",
			"md-sm": "30, 30, 15, 100, 100"
		}
	}
});