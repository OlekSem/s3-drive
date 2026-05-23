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
            providesTags: (result) =>
                result
                    ? [
                        { type: "Folder", id: "LIST" },
                        ...result.map(({ id }) => ({ type: "Folder" as const, id })),
                    ]
                    : [{ type: "Folder", id: "LIST" }],
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

        softDeleteNode: builder.mutation<void, number>({
            query: (nodeId) => ({
                url: "/nodes/SoftDelete",
                method: "DELETE",
                params: { nodeId },
            }),
            invalidatesTags: [
                { type: "Node", id: "LIST" },
                { type: "Node", id: "TRASH" },
                { type: "Folder", id: "LIST" }
            ],
        }),

        deleteNodePermanently: builder.mutation<void, { folderId?: number }>({
            query: ({ folderId }) => ({
                url: "/nodes/DeletePermanently",
                method: "DELETE",
                params: folderId ? { folderId } : {},
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
    useLazyDownloadFileQuery, // Using Lazy endpoint variant is standard practice for download triggers
    useRenameNodeMutation,
    useGetTrashNodesQuery,
    useSoftDeleteNodeMutation,
    useDeleteNodePermanentlyMutation,
    useRunErrorTestQuery,
} = fileStorageApi;