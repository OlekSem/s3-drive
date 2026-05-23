import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type IUser from "../../models/IUser.ts";
// Import your API service

const getUserFromToken = (token: string): IUser | null => {
    try {
        if (!token) return null;
        const decode = jwtDecode<IUser>(token);
        return decode ?? null;
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
};

// Safe fallback for server-side rendering or initial load environments
const token: string | undefined = localStorage.getItem('token') || undefined;
const user = token ? getUserFromToken(token) : null;

const initialState = {
    user: user
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Add this back so it can be successfully imported by components!
        loginSuccess: (state, action: PayloadAction<string>) => {
            const user = getUserFromToken(action.payload);
            if (user) {
                state.user = user;
                localStorage.setItem('token', action.payload);
            }
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('token');
        },
    }
});

// This export will now work perfectly and fix your SyntaxError
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;