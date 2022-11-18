const defaultTheme = require("tailwindcss/defaultTheme");
const { fontFamily } = require("../presets/typography.preset");
const colors = require("../presets/colors.preset");

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
	content: ["./src/pages/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
	plugins: [],
	theme: {
		colors,
		fontFamily: {
			display: [fontFamily.display, ...defaultTheme.fontFamily.sans],
			body: [fontFamily.body, ...defaultTheme.fontFamily.sans],
		},
		extend: {},
	},
};

module.exports = tailwindConfig;
