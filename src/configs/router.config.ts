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
		name: "Marketplace",
		path: "/marketplace",
	},
	{
		name: "DetailDrawing",
		path: "/detail-drawing",
	},
	{
		name: "RequestVerify",
		path: "/request-verify",
	},
	{
		name: "VerifyMaterial",
		path: "/verify-material/:id",
	},
] as const;
