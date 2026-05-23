import { useSearchParams } from "react-router-dom";
import { useState } from "react"; // Added to manage multi-selection if needed
import {
    useGetTrashNodesQuery,
    useDeleteNodePermanentlyMutation,
    // useRestoreNodeMutation
} from "../service/FileStorageService.ts";
import Finder from "./Finder.tsx";

export default function Trash() {
    const [searchParams] = useSearchParams();
    const folderParam = searchParams.get('id');
    const currentFolderId = folderParam ? parseInt(folderParam, 10) : null;

    // Track selected items for bulk actions if Finder relies on parent state
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const { data: trashFiles = [], error, isLoading } = useGetTrashNodesQuery({
        folderId: currentFolderId !== null ? currentFolderId : undefined
    });

    const [deletePermanently] = useDeleteNodePermanentlyMutation();

    // 🛠️ Modified to accept an array of IDs instead of a single ID
    const handleDeletePermanently = async (nodeIds: number[]) => {
        if (!nodeIds || nodeIds.length === 0) {
            alert("No items selected for deletion.");
            return;
        }

        const message = nodeIds.length === 1
            ? "Are you sure you want to permanently delete this item?"
            : `Are you sure you want to permanently delete these ${nodeIds.length} items?`;

        const confirmDelete = window.confirm(`${message} This action cannot be undone.`);
        if (!confirmDelete) return;

        try {
            // Pass the entire list of IDs directly to the mutation
            await deletePermanently(nodeIds).unwrap();
            setSelectedIds([]); // Clear selection on success
        } catch (err) {
            console.error(err);
            alert("Failed to delete items permanently");
        }
    };

    const handleRestoreNode = async (nodeIds: number[]) => {
        // Handle bulk restoration similarly when ready
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-red-500">Trash Bin</h1>

                {/* Optional: Bulk delete button outside Finder if Finder doesn't have internal headers */}
                {selectedIds.length > 0 && (
                    <button
                        onClick={() => handleDeletePermanently(selectedIds)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition"
                    >
                        Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            <Finder
                nodes={trashFiles}
                isLoading={isLoading}
                error={error}
                mode="trash"
                // Pass down your selection state handlers if Finder needs them:
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                // Update handlers to work with arrays seamlessly
                onDeletePermanently={handleDeletePermanently}
                onRestoreNode={handleRestoreNode}
            />
        </div>
    );
}