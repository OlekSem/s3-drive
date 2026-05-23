import { useSearchParams } from "react-router-dom";
import {
    useGetTrashNodesQuery,
    useDeleteNodePermanentlyMutation,
    // Назва хуку відновлення може відрізнятись у твоєму сервісі, перевір її:
    // useRestoreNodeMutation
} from "../service/FileStorageService.ts";
import Finder from "./Finder.tsx";

export default function Trash() {
    const [searchParams] = useSearchParams();
    const folderParam = searchParams.get('id');
    const currentFolderId = folderParam ? parseInt(folderParam, 10) : null;

    // Стягуємо видалені файли для поточної папки в смітнику
    const { data: trashFiles = [], error, isLoading } = useGetTrashNodesQuery({
        folderId: currentFolderId !== null ? currentFolderId : undefined
    });

    const [deletePermanently] = useDeleteNodePermanentlyMutation();
    // const [restoreNode] = useRestoreNodeMutation(); // Твій метод відновлення

    // Обробник видалення назавжди
    const handleDeletePermanently = async (nodeId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this item? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            // Передаємо id видаленого об'єкта в параметр folderId вашого API
            await deletePermanently({ folderId: nodeId }).unwrap();
        } catch (err) {
            console.error(err);
            alert("Failed to delete item permanently");
        }
    };

    // Обробник відновлення файлу/папки
    const handleRestoreNode = async (nodeId: number) => {
        // try {
        //     await restoreNode(nodeId).unwrap();
        //     alert("Item restored successfully");
        // } catch (err) {
        //     console.error(err);
        //     alert("Failed to restore item");
        // }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Trash Bin</h1>

            <Finder
                nodes={trashFiles}
                isLoading={isLoading}
                error={error}
                mode="trash" // <-- Включаємо режим кошика!
                onDeletePermanently={handleDeletePermanently}
                onRestoreNode={handleRestoreNode}
            />
        </div>
    );
}