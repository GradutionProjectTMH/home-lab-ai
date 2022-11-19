import * as React from "react";
import Button from "../components/button";
import Input from "../components/input";
import Stack from "../components/layout/stack";
import Text from "../components/typography/text";

const RequestVerify = () => {
	const [material, setMaterial] = React.useState<string>("");
	const [error, setError] = React.useState<string>("");

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(material);
		if (material.length === 0) return setError("Material is not empty.");
	};

	return (
		<section className="container mx-auto">
			<Stack className="justify-center items-center h-full">
				<form onSubmit={onSubmit}>
					<div className="mb-4">
						<Text>Material</Text>
						<Input value={material} error={error} onChange={(e) => setMaterial(e.target.value)} />
					</div>

					<div className="flex items-center justify-center">
						<Button typeButton="submit">Request</Button>
					</div>
				</form>
			</Stack>
		</section>
	);
};

export default RequestVerify;
