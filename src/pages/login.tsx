import React from "react";
import Button from "../components/button";
import Stack from "../components/layout/stack";
import H1 from "../components/typography/h1";

const Login = () => {
	const handleSubmit = () => {};
	return (
		<Stack className="w-full min-h-screen justify-center items-center">
			<form className="px-14 py-5 bg-white border-gray-300  shadow-xl shadow-blackAlpha-100">
				<Stack column={true} className="gap-10">
					<Stack column={true} className="gap-10 justify-center items-center">
						<H1>Login</H1>
						<Stack column={true} className="gap-3">
							<input type="email" name="email" className="bg-blue-100 p-2 rounded" />
							<input type="password" name="password" />
						</Stack>
					</Stack>
					<Button onSubmit={handleSubmit} type="fill">
						Login
					</Button>
				</Stack>
			</form>
		</Stack>
	);
};

export default Login;
