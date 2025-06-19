import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import counterReducer from "./Slice/Counter/CounterSlice";
import authSlice from "./Slice/Auth/AuthSlice";
import profileSlice from "./Slice/Profile/ProfileSlice";
import LoginAsClinicSlice from "./Slice/LoginAsClinic/LoginAsClinicSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  user: profileSlice,
  adminSessionAsClinic: LoginAsClinicSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
