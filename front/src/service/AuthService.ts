import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import API_ENV from "../env";
import {serialize} from "object-to-formdata";
import type IRegisterModel from "../models/IRegisterModel.ts";
import type ILoginModel from "../models/ILoginModel.ts";


export const authService = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_ENV.API_BASE_URL}/auth`,
    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        register: build.mutation<{token : string}, IRegisterModel>({
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
                const formData = serialize(model)
                return{
                    url: "/login",
                    method: "POST",
                    body: formData,
                }
            }
        })

    })
})