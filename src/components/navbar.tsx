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
import { joinTxts } from "../utils/text.util";

type NavbarProps = {} & React.HtmlHTMLAttributes<HTMLDivElement>;

const Navbar = ({ ...props }: NavbarProps) => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user);
	const ether = useSelector((state: RootState) => state.ether);
	const [fixNav, setFixNav] = React.useState<boolean>(false);
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

	const onScrollWindow = () => {
		if (window.scrollY === 0) {
			setFixNav(false);
		} else {
			setFixNav(true);
		}
	};

	window.addEventListener("scroll", onScrollWindow);
	// fixNav ? "scale-90" : "scale-100"
	return (
		<nav className={joinTxts("w-full", fixNav ? "shadow-md" : "")} {...props}>
			<div className="container mx-auto">
				<Stack className={joinTxts(" py-6 items-center ", fixNav ? "h-20" : "h-32")}>
					<Link to="/" className={joinTxts("", fixNav ? "w-1/6" : "w-1/4")}>
						<Stack className={joinTxts("", fixNav ? "w-56" : "w-72")}>
							<img src="../images/logo-full-horizontal.png" alt="Logo" />
						</Stack>
					</Link>
					<Stack className={joinTxts("w-1/2 mx-auto")}>
						{routes
							.filter((route) => route.isNav)
							.map((route) => (
								<Link
									to={route.path}
									key={route.name}
									className={joinTxts("text-gray-500 hover:text-gray-600 ease-linear transition-[margin] duration-300")}
									getProps={({ isPartiallyCurrent }) => ({
										className: isPartiallyCurrent
											? joinTxts("text-gray-600", fixNav ? "mr-4" : "mr-16")
											: joinTxts("", fixNav ? "mr-4" : "mr-16"),
									})}
								>
									<H5 className={joinTxts("transition-all duration-300", fixNav ? "!text-base" : "!text-lg")}>
										{route.name}
									</H5>
								</Link>
							))}
					</Stack>

					<Stack className={joinTxts("justify-end gap-2", fixNav ? "w-2/6" : "w-1/4")}>
						<Button
							onClick={handleConnect}
							RightItem={MetamaskSvg}
							type="outline"
							className={joinTxts(
								"!text-orange-600 !border-orange-600  transition-all duration-300 ease-linear",
								fixNav ? "!px-2 !py-1" : "!px-3 !py-2",
							)}
						>
							<H5 className={joinTxts("", fixNav ? "!text-base" : "!text-lg")}>{wallet || "Connect"}</H5>
						</Button>
						{user ? (
							<Stack
								className={joinTxts(
									"items-center cursor-pointer hover:bg-gray-200 hover:rounded ",
									fixNav ? "px-2 py-1" : "px-3 py-2",
								)}
								onClick={() => setShowDropdown(!showDropdown)}
							>
								<Stack className={joinTxts("justify-center items-center", fixNav ? "w-[32px]" : "w-[45px]")}>
									<Stack className="rounded-full border-white border-2 overflow-hidden ">
										<img className="object-cover" src={user.avatar} />
									</Stack>
								</Stack>
								<div className="relative inline-block text-left">
									<div>
										<div
											className={joinTxts(
												"absolute right-0 z-100 mt-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
												!showDropdown ? "hidden" : null,
											)}
										>
											<div className="py-1">
												<a href="#" className="hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm">
													Account settings
												</a>
												<a href="#" className="hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm">
													Support
												</a>
												<a href="#" className="hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm">
													License
												</a>
												<a
													href="#"
													className="hover:bg-gray-100 text-gray-700 block px-4 py-2 text-sm"
													onClick={handleLogout}
												>
													Sign out
												</a>
											</div>
										</div>
									</div>
								</div>
							</Stack>
						) : (
							<Button
								onClick={handleLoginGoogle}
								RightItem={GoogleSvg}
								type="outline"
								className={joinTxts(" transition-all duration-300 ease-linear", fixNav ? "!px-2 !py-1" : "!px-3 !py-2")}
							>
								<H5 className={joinTxts("transition-all duration-300", fixNav ? "!text-base" : "!text-lg")}>Sign In</H5>
							</Button>
						)}
					</Stack>
				</Stack>
			</div>
		</nav>
	);
};

export default Navbar;
