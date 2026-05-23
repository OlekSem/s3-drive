import { useSearchParams } from "react-router-dom";
import {
    useCreateFolderMutation,
    useGetFolderViewQuery, useRenameNodeMutation,
    useSoftDeleteNodeMutation
} from "../service/FileStorageService.ts";
import Finder from "./Finder.tsx";



export default function Folder(){
    const [searchParams] = useSearchParams();
    const folderParam = searchParams.get('id');
    const currentFolderId = folderParam ? parseInt(folderParam, 10) : null;

    // Стягуємо дані
    const { data: files = [], error, isLoading } = useGetFolderViewQuery({
        folderId: currentFolderId !== null ? currentFolderId : undefined
    });

    const [createFolder] = useCreateFolderMutation();
    const [softDeleteNode] = useSoftDeleteNodeMutation();




    const [renameNode] = useRenameNodeMutation();

    const handleRenameNode = async (id: number, newName: string) => {
        await renameNode({ id, newName }).unwrap();
    };

    const handleCreateFolder = async (parentId: number | null) => {
        try {
            await createFolder({ parentId: parentId ?? undefined }).unwrap();
        } catch (err) {
            console.log(err);
            alert("Failed to create folder");
        }
    };

    // Змінюємо аргумент з поодинокого nodeId на масив nodeIds
    const handleDeleteNode = async (nodeIds: number[]) => {
        try {
            // Тепер передаємо сформований масив прямо в мутацію,
            // оскільки Finder уже зібрав потрібні ID (один або декілька)
            await softDeleteNode(nodeIds).unwrap();
        } catch (err) {
            console.log(err);
            alert("Error while deleting");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Storage Explorer</h1>


            <Finder
                nodes={files}
                isLoading={isLoading}
                error={error}
                rootFolderName="Cloud Space"
                onCreateFolder={handleCreateFolder}
                onDeleteNode={handleDeleteNode} // Тепер типи ідеально збігаються
                onDownloadFile={(file) => alert(`Downloading: ${file.storageKey}`)}
                onRenameNode={handleRenameNode}
                onUploadClick={(folderId) => alert(`Upload triggered for folder: ${folderId}`)}
            />
        </div>
    )
}
