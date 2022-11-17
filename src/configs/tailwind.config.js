const defaultTheme = require("tailwindcss/defaultTheme");
const { fontFamily } = require("../presets/typography.preset");

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
	content: ["./src/pages/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
	plugins: [],
	theme: {
		fontFamily: {
			display: [fontFamily.display, ...defaultTheme.fontFamily.sans],
			body: [fontFamily.body, ...defaultTheme.fontFamily.sans],
		},
		extend: {},
	},
};

module.exports = tailwindConfig;
