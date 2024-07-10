import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/home/Home";
import Movie from "./components/pages/movie/Movie";
import NotFound from "./components/pages/notfound/NotFound";
import Auth from "./components/pages/auth/Auth";
import Account from "./components/pages/account/Account.tsx";
import NavbarMin from "./components/navbar/NavbarMin";
import Search from "./components/pages/search/Search";
function App() {
	return (
		<div className="App">
			<div>
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
			</div>
			<NavbarMin />
			<Routes>
				<Route exact path="/" element={<Home />} />
				{/* <Route path="/create" element={<Create />} /> */}
				<Route path="/search" element={<Search />} />
				<Route path="/movie/:id" element={<Movie />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/account" element={<Account />} />
				<Route path="*" exact={true} element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
