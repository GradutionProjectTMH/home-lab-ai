import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import * as React from "react";
import * as authApi from "../apis/server/auth.api";
import GoogleSvg from "../svgs/google.svg";
import MetamaskSvg from "../svgs/metamask.svg";
import { signInWithGoogle } from "../apis/firebase.api";
import Button from "./button";
import Stack from "./layout/stack";
import H5 from "./typography/h5";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/stores/store.redux";
import Avatar from "./avatar";
import { updateUser } from "../redux/slices/user.slice";
import { LOGIN_NOT_SUCCESSFULLY } from "../constants/error.constant";
import Ether from "../apis/ether.api";
import { pushSuccess } from "../redux/slices/message.slice";
import { ethers } from "ethers";
import { connectWallet } from "../redux/slices/ether.slice";

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
		path: "/order",
	},

	{
		name: "AddToMarketplace",
		path: "/add-to-marketplace",
	},
	{
		name: "Marketplace",
		path: "/marketplace",
	},
];

type NavbarProps = {} & React.HtmlHTMLAttributes<HTMLDivElement>;

<Link to="/">
	<H5 className="text-gray-700">Home</H5>
</Link>;

const Navbar = ({ ...props }: NavbarProps) => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const ether = useSelector((state: RootState) => state.ether);
	const [walletAddress, setWalletAddress] = React.useState<string>();

	const handleLoginGoogle = async () => {
		try {
			const token = await signInWithGoogle();
			if (!token) throw new Error(LOGIN_NOT_SUCCESSFULLY);

			const user = await authApi.loginByGoogle(token);
			if (user.token) {
				window?.localStorage.setItem("token", user.token);
				return dispatch(updateUser(user));
			}

			throw new Error(LOGIN_NOT_SUCCESSFULLY);
		} catch (error) {
			window?.localStorage.removeItem("token");
			dispatch(updateUser(null));

			throw error;
		}
	};

	const handleLogout = () => {
		window?.localStorage.removeItem("token");
		dispatch(updateUser(null));
	};

	const handleConnect = async () => {
		await ether.provider.send("eth_requestAccounts", []);
		if (!Ether.isConnected()) throw new Error("Can't connect to Metamask");

		setWalletAddress(await ether.provider.getSigner().getAddress());
		dispatch(pushSuccess("Connected to Metamask"));
	};

	const wallet = walletAddress && `${walletAddress.substring(0, 7)}...`;

	return (
		<nav className="bg-gray-50" {...props}>
			<div className="container mx-auto">
				<Stack className="pt-12 pb-6 items-center">
					<Link to="/" className="basis-1/4">
						<StaticImage src="../images/logo-full-horizontal.png" alt="Logo" height={64} />
					</Link>
					<Stack className="basis-1/2 justify-center gap-14">
						{routes.map((route) => (
							<Link
								to={route.path}
								key={route.name}
								className="text-gray-500 hover:text-gray-600"
								activeClassName="text-gray-600"
								partiallyActive={route.path == "/" ? false : true}
							>
								<H5>{route.name}</H5>
							</Link>
						))}
					</Stack>

					<Stack className="basis-1/4 justify-end gap-2">
						<Button
							onClick={handleConnect}
							RightItem={MetamaskSvg}
							type="outline"
							className="!text-orange-600 !border-orange-600 !px-3 !py-2"
						>
							{wallet || "Connect"}
						</Button>
						{user ? (
							<Stack
								className="items-center cursor-pointer hover:bg-gray-200 hover:rounded px-3 py-2"
								onClick={handleLogout}
							>
								<Avatar src={user.avatar} />
							</Stack>
						) : (
							<Button onClick={handleLoginGoogle} RightItem={GoogleSvg} type="outline" className="!px-3 !py-2">
								Sign In
							</Button>
						)}
					</Stack>
				</Stack>
			</div>
		</nav>
	);
};

export default Navbar;
