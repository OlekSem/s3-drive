import type {NodeType} from "../pages/Finder.tsx";

export default interface NodeResponseDto {
    id: number;
    name: string;
    type: NodeType;
    size: number | null;
    mimeType: string | null;
    storageKey: string | null;
    userId: number;
    parentId: number | null;
    createdAt: string;
    updatedAt: string;
}