import {useSearchParams} from "react-router-dom";
import {
    useCreateFolderMutation,
    useGetFolderViewQuery,
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

    // Обертаємо мутації в прості обробники подій
    const handleCreateFolder = async (parentId: number | null) => {
        try {
            await createFolder({ parentId: parentId ?? undefined }).unwrap();
        } catch (err) {
            console.log(err);
            alert("Failed to create folder");
        }
    };

    const handleDeleteNode = async (nodeId: number) => {
        try {
            await softDeleteNode(nodeId).unwrap();
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
                onDeleteNode={handleDeleteNode}
                onDownloadFile={(file) => alert(`Downloading: ${file.storageKey}`)}
                onUploadClick={(folderId) => alert(`Upload triggered for folder: ${folderId}`)}
            />
        </div>
    )
}
