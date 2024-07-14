import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import { BrowserRouter } from "react-router-dom";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import App from "./App";

import "./index.css";

const persistConfig = {
	key: "root",
	storage: storage,
	stateReconciler: autoMergeLevel2,
};
const pReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({ reducer: { root: pReducer } });
let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>
);
