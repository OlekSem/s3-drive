// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import APP_ENV from "../env";
// import { Book } from "../Interfaces/Books/Book.ts"; // Перевірте правильність шляхів
// import { BookCreate } from "../Interfaces/Books/BookCreate.ts";
// import BookFull from "../Interfaces/Books/BookFull.ts";
// import { BookWithLib } from "../Interfaces/Books/BookWithLib.ts";
//
//
//
//
//
//
// //Залишаю цей файл як приклад Apiшки
// export const appApi = createApi({
//     reducerPath: "appApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: APP_ENV.API_BASE_URL + "/api",
//         prepareHeaders: (headers) => {
//             const token = localStorage.getItem("token");
//             if (token) {
//                 headers.set("Authorization", `Bearer ${token}`);
//             }
//             return headers;
//         },
//     }),
//     tagTypes: ["Book", "Library"],
//     endpoints: (builder) => ({
//         // ================= LAIBRARAY ENDPOINTS =================
//         getLibrary: builder.query<Book[], void>({
//             query: () => "/me/library",
//             providesTags: ["Library"],
//         }),
//
//         addToLibrary: builder.mutation<void, number>({
//             query: (bookId) => ({
//                 url: `/me/library/${bookId}`,
//                 method: "POST",
//             }),
//             // ТЕПЕР ЦЕ ПРАЦЮЄ! Оновлюємо і бібліотеку, і список книг
//             invalidatesTags: ["Library", { type: "Book", id: "LIST" }],
//         }),
//
//         removeFromLibrary: builder.mutation<void, number>({
//             query: (bookId) => ({
//                 url: `/me/library/${bookId}`,
//                 method: "DELETE",
//             }),
//             invalidatesTags: ["Library", { type: "Book", id: "LIST" }],
//         }),
//
//         // ================= BOOKS ENDPOINTS =================
//         getBooks: builder.query<BookWithLib[], void>({
//             query: () => "/books",
//             providesTags: (result) =>
//                 result
//                     ? [
//                         { type: "Book", id: "LIST" },
//                         ...result.map(({ id }) => ({ type: "Book" as const, id })),
//                     ]
//                     : [{ type: "Book", id: "LIST" }],
//         }),
//
//         getBookById: builder.query<BookFull, number>({
//             query: (id) => `/books/${id}`,
//         }),
//
//         createBook: builder.mutation<BookCreate, FormData>({
//             query: (formData) => ({
//                 url: "/books",
//                 method: "POST",
//                 body: formData,
//             }),
//             invalidatesTags: [{ type: "Book", id: "LIST" }],
//         }),
//
//         deleteBook: builder.mutation<void, number>({
//             query: (id) => ({
//                 url: `/books/${id}`,
//                 method: "DELETE",
//             }),
//             invalidatesTags: [{ type: "Book", id: "LIST" }],
//         }),
//
//         updateBook: builder.mutation<Book, { id: number; title: string; author: string }>({
//             query: ({ id, title, author }) => ({
//                 url: `/books/${id}`,
//                 method: "PUT",
//                 body: { title, author },
//             }),
//             invalidatesTags: [{ type: "Book", id: "LIST" }],
//         }),
//     }),
// });
//
// export const {
//     useGetLibraryQuery,
//     useAddToLibraryMutation,
//     useRemoveFromLibraryMutation,
//     useGetBooksQuery,
//     useGetBookByIdQuery,
//     useCreateBookMutation,
//     useDeleteBookMutation,
//     useUpdateBookMutation,
// } = appApi;