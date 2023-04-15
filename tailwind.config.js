const defaultTheme = require("tailwindcss/defaultTheme");
const { fontFamily } = require("./src/presets/typography.preset");
const colors = require("./src/presets/colors.preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/pages/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
	plugins: [require("@tailwindcss/forms")],
	theme: {
		colors,
		fontFamily: {
			display: [fontFamily.display, ...defaultTheme.fontFamily.sans],
			body: [fontFamily.body, ...defaultTheme.fontFamily.sans],
			body2: [fontFamily.body2, ...defaultTheme.fontFamily.sans],
		},
		extend: {},
	},
};
