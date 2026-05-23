export interface INodeResponse {
    id: number;
    name: string;
    type: "FILE" | "FOLDER";
    size: number;
    mimeType: string;
    storageKey: string;
    ownerId: number;
    parentId: number;
    createdAt: string;
    updatedAt: string;
}

export interface IRenameNodeRequest {
    id: number;
    newName: string;
}