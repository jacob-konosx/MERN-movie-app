import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import { BrowserRouter } from "react-router-dom";

const store = configureStore({ reducer: { root: rootReducer } });

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);
