"use strict";

import plugin from "tailwindcss/plugin";
import { generateBulged } from "./src/libs/bulged";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

export const isFunction = func => {
	return !!(func && func.constructor && func.call && func.apply);
};

const SVGPolygonToClip = polygon => {

	let clipPath = "polygon(";

	for (let i = 0; i < polygon.length - 1; i++) {

		const c = polygon[i];

		switch (c) {
			case ",":
				clipPath += "% ";
				break;
			case " ":
				clipPath += "%,";
				break;
			default:
				clipPath += c;
		}
	}

	return clipPath + "%)";
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
		"clip": value => ({
			clipPath: SVGPolygonToClip(generateBulged(...value.split(/,\s*/)).polygon)
		})
	}, {
		values: flattenColorPalette(theme("clipPath")),
		supportsNegativeValues: false
	});
}, {
	theme: {
		clipPath: {
			"none": "none",
			"bulged": {
				"lg-lg-lg": "40, 40, 25",
				"lg-lg-md": "40, 40, 10",
				"lg-lg-sm": "40, 40, 0",
				"lg-md-lg": "40, 20, 25",
				"lg-md-md": "40, 20, 10",
				"lg-md-sm": "40, 20, 0",
				"lg-sm-lg": "40, 10, 25",
				"lg-sm-md": "40, 10, 10",
				"lg-sm-sm": "40, 10, 0",
				"md-lg-lg": "20, 40, 25",
				"md-lg-md": "20, 40, 10",
				"md-lg-sm": "20, 40, 0",
				"md-md-lg": "20, 20, 25",
				"md-md-md": "20, 20, 10",
				"md-md-sm": "20, 20, 0",
				"md-sm-lg": "20, 10, 25",
				"md-sm-md": "20, 10, 10",
				"md-sm-sm": "20, 10, 0",
				"sm-lg-lg": "10, 40, 25",
				"sm-lg-md": "10, 40, 10",
				"sm-lg-sm": "10, 40, 0",
				"sm-md-lg": "10, 20, 25",
				"sm-md-md": "10, 20, 10",
				"sm-md-sm": "10, 20, 0",
				"sm-sm-lg": "10, 10, 25",
				"sm-sm-md": "10, 10, 10",
				"sm-sm-sm": "10, 10, 0"
			}
		}
	}
});