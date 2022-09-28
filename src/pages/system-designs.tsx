import * as React from "react";
import type { HeadFC } from "gatsby";
import Body from "../components/body";
import Seo from "../components/seo";
import H1 from "../components/typography/h1";
import H2 from "../components/typography/h2";
import H3 from "../components/typography/h3";
import H4 from "../components/typography/h4";
import H5 from "../components/typography/h5";

const SystemDesign = () => {
	return (
		<Body>
			<div className="container mx-auto">
				<H1>Heading 1</H1>
				<H2>Heading 2</H2>
				<H3>Heading 3</H3>
				<H4>Heading 4</H4>
				<H5>Heading 5</H5>
			</div>
		</Body>
	);
};

export default SystemDesign;

export const Head: HeadFC = () => <Seo title="System Designs" />;
