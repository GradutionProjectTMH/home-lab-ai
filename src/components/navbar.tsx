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
import { joinTxts } from "../utils/text.util";
import { updateUserProfile } from "../apis/user.api";

const navRoutes = [
	{
		name: "Tìm ý tưởng",
		path: "/",
	},
	{
		name: "Thiết kế",
		path: "/build",
	},
];

type NavbarProps = {
	fixNav?: boolean;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

const Navbar = ({ fixNav = false, ...props }: NavbarProps) => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const ether = useSelector((state: RootState) => state.ether);
	const [wallet, setWallet] = React.useState<string>();
	const [showDropdown, setShowDropdown] = React.useState<boolean>(false);

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
		await ether!.provider.send("eth_requestAccounts", []);
		if (!Ether!.isConnected()) throw new Error("Can't connect to Metamask");

		const walletAddress = await ether!.provider.getSigner().getAddress();
		dispatch(setWalletAddress(walletAddress));
		dispatch(pushSuccess("Connected to Metamask"));
	};

	React.useEffect(() => {
		(async () => {
			if (ether?.walletAddress) {
				setWallet(formatAddress(ether!.walletAddress));
			}
		})();
	}, [ether, ether?.walletAddress]);

	return (
		<nav className={joinTxts("w-full", fixNav ? "shadow-md" : "")} {...props}>
			<div className="container mx-auto">
				<Stack className={joinTxts(" py-6 items-center", fixNav ? "h-20" : "h-32")}>
					<Link to="/" className={joinTxts("", fixNav ? "w-1/6" : "w-1/4")}>
						<Stack className={joinTxts("", fixNav ? "w-56" : "w-72")}>
							<img src="../images/logo-full-horizontal.png" alt="Logo" />
						</Stack>
					</Link>
					<div>
						<Stack className={joinTxts("m-auto", fixNav ? "w-auto gap-8" : "w-fit gap-16")}>
							{navRoutes.map((route) => (
								<Link
									to={route.path}
									key={route.name}
									className={joinTxts("hover:text-primary ease-linear transition-[margin] duration-300")}
									getProps={({ isCurrent }) => {
										return {
											className: isCurrent ? "float-left text-primary" : "float-left text-gray-500",
										};
									}}
								>
									<H5 className={joinTxts("transition-all duration-300", fixNav ? "!text-base" : "!text-xl")}>
										{route.name}
									</H5>
								</Link>
							))}
						</Stack>
					</div>
				</Stack>
			</div>
		</nav>
	);
};

export default Navbar;
