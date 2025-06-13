/** @type {import('tailwindcss').Config} */

import { clip } from './tw-plugins';

export default {
	content: ["./**/*.{html,jsx}"],
	theme: {
		extend: {},
	},
	plugins: [
		clip
	],
}

