export const routes = [
	{
		name: "Home",
		path: "/",
	},
	{
		name: "Build",
		path: "/build",
	},
	{
		name: "Order",
		path: "/order/:id",
	},
	{
		name: "AddToMarketplace",
		path: "/add-to-marketplace",
	},
	{
		name: "Marketplace",
		path: "/marketplace",
	},
	{
		name: "DetailDrawing",
		path: "/detail-drawing",
	},
] as const;
