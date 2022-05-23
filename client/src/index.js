import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import { BrowserRouter } from "react-router-dom";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { PersistGate } from "redux-persist/integration/react";
const persistConfig = {
	key: "root",
	storage: storage,
	stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
};
const pReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({ reducer: { root: pReducer } });
let persistor = persistStore(store);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<BrowserRouter>
				<App />
			</BrowserRouter>{" "}
		</PersistGate>
	</Provider>
);
