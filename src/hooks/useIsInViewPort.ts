import { MutableRefObject, useEffect, useMemo, useState } from "react";

export const useIsInViewport = (ref: MutableRefObject<any>) => {
	const [isIntersecting, setIsIntersecting] = useState(false);

	const observer = useMemo(() => new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting)), []);

	useEffect(() => {
		if (!ref.current) return;
		observer.observe(ref.current);

		return () => {
			observer.disconnect();
		};
	}, [ref.current, observer]);

	return isIntersecting;
};
