const defaultTheme = require("tailwindcss/defaultTheme");
const { fontFamily } = require("./presets/typography.preset");
const colors = require("./presets/colors.preset");

const flowbite = require("flowbite/plugin");
flowbite.config.theme.extend.colors = colors;

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,jsx,ts,tsx}",
		"./src/components/**/*.{js,jsx,ts,tsx}",
		"node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	plugins: [require("flowbite/plugin")],
	theme: {
		fontFamily: {
			display: [fontFamily.display, ...defaultTheme.fontFamily.sans],
			body: [fontFamily.body, ...defaultTheme.fontFamily.sans],
		},
		extend: {},
	},
};
