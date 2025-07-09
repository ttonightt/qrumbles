/** @type {import('tailwindcss').Config} */

import { clip } from './tw-plugins';

export default {
	content: ["./**/*.{html,jsx}"],
	theme: {
		font: {
			"mono": "Courier New"
		},
		extend: {
			
		},
	},
	plugins: [
		clip
	],
}

