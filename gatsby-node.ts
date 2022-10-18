export const onCreateWebpackConfig = ({ stage, rules, loaders, plugins, actions }: any) => {
	// if (stage === "build-html") {
	actions.setWebpackConfig({
		externals: ["canvas"],
	});
	// }
};
