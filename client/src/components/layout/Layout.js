import { Outlet } from "react-router-dom";
import NavigationBar from "../navigationBar/NavigationBar";

import "./Layout.css";

const Layout = () => {
	return (
		<div className="App">
			<svg
				className="waves"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				viewBox="0 24 150 28"
				preserveAspectRatio="none"
				shapeRendering="auto"
			>
				<defs>
					<path
						id="gentle-wave"
						d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
					/>
				</defs>
				<g className="parallax">
					<use
						xlinkHref="#gentle-wave"
						x="48"
						y="0"
						fill="rgb(45,146,224)"
					/>
					<use
						xlinkHref="#gentle-wave"
						x="48"
						y="4"
						fill="rgba(45,146,224,0.7)"
					/>
					<use
						xlinkHref="#gentle-wave"
						x="48"
						y="6"
						fill="rgba(45,146,224,0.5)"
					/>
					<use
						xlinkHref="#gentle-wave"
						x="48"
						y="8"
						fill="rgba(45,146,224,0.3)"
					/>
				</g>
			</svg>

			<NavigationBar />

			<div className="page">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
