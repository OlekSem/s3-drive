import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import API_ENV from "../env";
// import {serialize} from "object-to-formdata";
import type IRegisterModel from "../models/IRegisterModel.ts";
import type ILoginModel from "../models/ILoginModel.ts";
import {serialize} from "object-to-formdata";


export const authService = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_ENV.API_BASE_URL}/api/auth/`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        register: build.mutation<{
            email: string,
            id: number,
            username: string,
        }, IRegisterModel>({
            query: (model)=>{
                const formData = serialize(model)
                return {
                    url: "/register",
                    method: "POST",
                    body: formData,
                }
            },
            invalidatesTags: ["Auth"]
        }),
        login: build.mutation<{token : string}, ILoginModel>({
            query: (model)=>{
                // const formData = serialize(model)
                return{
                    url: "login",
                    method: "POST",
                    body: model,
                }
            }
        })
    })
})