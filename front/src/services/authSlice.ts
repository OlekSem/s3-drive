import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type UserTokenInfo from "../Interfaces/User/UserTokenInfo.ts";
import {jwtDecode} from "jwt-decode";

const getUserFromToken = (token: string) : UserTokenInfo | null  => {
    try {
        if (!token) {
            return null;
        }
        const decode = jwtDecode<UserTokenInfo>(token);
        return decode ?? null;
    }
    catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}

const token = localStorage.token;
const user = getUserFromToken(token);

const initialState = {
    user,
    isAdmin: !!user?.roles?.includes('ROLE_ADMIN')
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<string>) => {
            const user = getUserFromToken(action.payload);

            if (user) {
                state.user = user;
                state.isAdmin = user.roles?.includes('ROLE_ADMIN') ?? false;
                localStorage.setItem('token', action.payload);
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAdmin = false;
            localStorage.removeItem('token');

        },
    }
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
