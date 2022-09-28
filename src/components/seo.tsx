import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";

type SeoProps = {
	title: string;
	description?: string;
	children?: React.ReactNode;
};

function Seo({ title, description, children }: SeoProps) {
	const { site } = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
					}
				}
			}
		`,
	);

	const metaDescription = description || site.siteMetadata.description;
	const defaultTitle = site.siteMetadata?.title;

	return (
		<React.Fragment>
			<title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
			<meta name="description" content={metaDescription} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={metaDescription} />
			<meta property="og:type" content="website" />
			{children}
		</React.Fragment>
	);
}

export default Seo;
