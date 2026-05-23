import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_ENV from "../env"; // Match your environment variable configurations
import type { INodeResponse, IRenameNodeRequest } from "../interfaces.ts";

export const fileStorageApi = createApi({
    reducerPath: "fileStorageApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_ENV.API_BASE_URL}/api`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Folder", "File", "Node"],
    endpoints: (builder) => ({

        // ================= FOLDER ENDPOINTS =================
        createFolder: builder.mutation<string, { parentId?: number }>({
            query: ({ parentId }) => ({
                url: "/folder/create",
                method: "POST",
                params: parentId ? { parentId } : {}, // Query params
            }),
            invalidatesTags: [{ type: "Folder", id: "LIST" }, { type: "Node", id: "LIST" }],
        }),
        getFolderView: builder.query<INodeResponse[], { folderId?: number }>({
            query: ({ folderId }) => ({
                url: "/folder/view",
                method: "GET",
                params: folderId ? { folderId } : {},
            }),
            // ВИПРАВЛЕНО: додаємо прив'язку до тегу "Node", щоб список оновлювався при видаленні/відновленні
            providesTags: (result) =>
                result
                    ? [
                        { type: "Folder", id: "LIST" },
                        { type: "Node", id: "LIST" }, // Тег для всього списку нод
                        ...result.map(({ id }) => ({ type: "Node" as const, id })), // Тег для кожної окремої ноди
                    ]
                    : [{ type: "Folder", id: "LIST" }, { type: "Node", id: "LIST" }],
        }),

        // ================= FILE ENDPOINTS =================
        uploadFile: builder.mutation<string, { parentId?: number; formData: FormData }>({
            query: ({ parentId, formData }) => ({
                url: "/files/upload",
                method: "POST",
                params: parentId ? { parentId } : {},
                body: formData,
            }),
            invalidatesTags: [{ type: "File", id: "LIST" }, { type: "Node", id: "LIST" }, { type: "Folder", id: "LIST" }],
        }),

        downloadFile: builder.query<Blob, number>({
            query: (id) => ({
                url: `/files/download/${id}`,
                method: "GET",
                responseHandler: (response) => response.blob(), // Extract payload as stream blob file
            }),
        }),

        // ================= NODE ENDPOINTS =================
        renameNode: builder.mutation<INodeResponse, IRenameNodeRequest>({
            query: ({ id, newName }) => ({
                url: `/nodes/rename/${id}`,
                method: "PATCH",
                body: { newName },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Node", id },
                { type: "Folder", id: "LIST" },
                { type: "Node", id: "LIST" }
            ],
        }),

        getTrashNodes: builder.query<INodeResponse[], { folderId?: number }>({
            query: ({ folderId }) => ({
                url: "/nodes/trash",
                method: "GET",
                params: folderId ? { folderId } : {},
            }),
            providesTags: [{ type: "Node", id: "TRASH" }],
        }),

// service/FileStorageService.ts

// Альтернативний залізобетонний варіант для сервісу, якщо звичайний body ігнорується:
        softDeleteNode: builder.mutation<void, number[]>({
            query: (nodeIds) => ({
                url: '/nodes/SoftDelete',
                method: 'DELETE',
                body: nodeIds,
            }),
            // ВИПРАВЛЕНО: тепер цей запит чітко каже оновити і звичайний список ("LIST"), і кошик ("TRASH")
            invalidatesTags: [
                { type: "Node", id: "LIST" },
                { type: "Node", id: "TRASH" },
                { type: "Folder", id: "LIST" }
            ],
        }),

        deleteNodePermanently: builder.mutation<void, number[]>({
            query: (nodeIds) => ({
                url: "/nodes/DeletePermanently",
                method: "DELETE",
                body: nodeIds, // Send the raw array as the JSON body
            }),
            invalidatesTags: [{ type: "Node", id: "TRASH" }],
        }),

        // ================= SYSTEM/ERROR TEST ENDPOINTS =================
        runErrorTest: builder.query<string, void>({
            query: () => "/error-test",
        }),
    }),
});

// Auto-generated structural custom hooks
export const {
    useCreateFolderMutation,
    useGetFolderViewQuery,
    useUploadFileMutation,
    useRenameNodeMutation,
    useGetTrashNodesQuery,
    useSoftDeleteNodeMutation,
    useDeleteNodePermanentlyMutation,
    useRunErrorTestQuery,
} = fileStorageApi;