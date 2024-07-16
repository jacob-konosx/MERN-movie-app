import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Movie from "./pages/movie/Movie";
import NotFound from "./pages/notfound/NotFound";
import Auth from "./pages/auth/Auth";
import Account from "./pages/account/Account";
import Search from "./pages/search/Search";
import Layout from "./components/layout/Layout";

const App = () => {
	return (
		<Routes>
			<Route element={<Layout />} path="/">
				<Route index element={<Home />} />
				<Route path="search" element={<Search />} />
				<Route path="movie/:id" element={<Movie />} />
				<Route path="auth" element={<Auth />} />
				<Route path="account" element={<Account />} />
				<Route path="*" exact={true} element={<NotFound />} />
			</Route>
		</Routes>
	);
};

export default App;
