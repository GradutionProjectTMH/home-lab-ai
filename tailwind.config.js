const defaultTheme = require("tailwindcss/defaultTheme");
const { fontFamily } = require("./presets/typography.preset");
const colors = require("./presets/colors.preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/pages/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
	theme: {
		colors,
		fontFamily: {
			display: [fontFamily.display, ...defaultTheme.fontFamily.sans],
			body: [fontFamily.body, ...defaultTheme.fontFamily.sans],
		},
		extend: {},
	},
	plugins: [],
};
