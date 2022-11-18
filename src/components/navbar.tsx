import * as React from "react";
import { Link } from "@reach/router";
import * as authApi from "../apis/server/auth.api";
import { ReactComponent as GoogleSvg } from "../svgs/google.svg";
import { ReactComponent as MetamaskSvg } from "../svgs/metamask.svg";
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
import { setWalletAddress } from "../redux/slices/ether.slice";
import { formatAddress } from "../utils/text.util";
import { routes } from "../pages/navigator";

type NavbarProps = {} & React.HtmlHTMLAttributes<HTMLDivElement>;

const Navbar = ({ ...props }: NavbarProps) => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const ether = useSelector((state: RootState) => state.ether);
	const [wallet, setWallet] = React.useState<string>();

	const handleLoginGoogle = async (): Promise<void> => {
		try {
			const token = await signInWithGoogle();
			if (!token) throw new Error(LOGIN_NOT_SUCCESSFULLY);

			const user = await authApi.loginByGoogle(token);
			if (user.token) {
				window?.localStorage.setItem("token", user.token);
				dispatch(updateUser(user));
				return;
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

		const walletAddress = await ether.provider.getSigner().getAddress();
		dispatch(setWalletAddress(walletAddress));
		dispatch(pushSuccess("Connected to Metamask"));
	};

	React.useEffect(() => {
		(async () => {
			if (ether.walletAddress) {
				setWallet(formatAddress(ether.walletAddress));
			}
		})();
	}, [ether.initiated, ether.walletAddress]);

	return (
		<nav className="bg-gray-50" {...props}>
			<div className="container mx-auto">
				<Stack className="pt-12 pb-6 items-center">
					<Link to="/" className="basis-1/4">
						<img src="../images/logo-full-horizontal.png" alt="Logo" height={64} />
					</Link>
					<Stack className="basis-1/2 justify-center gap-14">
						{routes
							.filter((route) => route.isNav)
							.map((route) => (
								<Link
									to={route.path}
									key={route.name}
									className="text-gray-500 hover:text-gray-600"
									getProps={({ isPartiallyCurrent }) => ({
										className: isPartiallyCurrent ? "text-gray-600" : "",
									})}
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
