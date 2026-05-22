import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authService} from "../service/AuthService.ts";
import authReducer from "../store/reducers/AuthSlice.ts";

const rootReducer = combineReducers({
    [authService.reducerPath]: authService.reducer,
    authReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                authService.middleware,
            ),
    })
}


export type  RootState = ReturnType<typeof rootReducer>
export type  AppStore = ReturnType<typeof setupStore>
export type  AppDispatch = AppStore['dispatch'];