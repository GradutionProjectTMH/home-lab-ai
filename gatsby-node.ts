export const onCreateWebpackConfig = ({ stage, rules, loaders, plugins, actions }: any) => {
	actions.setWebpackConfig({
		externals: ["canvas"],
	});
};
