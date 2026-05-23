import {useSearchParams} from "react-router-dom";
import {useGetFolderViewQuery} from "../service/FileStorageService.ts";


export default function Folder(){
    const [searchParams, setSearchParams] = useSearchParams();

    // Grabs the value of 'id' from the URL (e.g., /finder?id=abc)
    const id = searchParams.get('id');

    const { data: nodes, error, isLoading } = useGetFolderViewQuery({});

    if (isLoading) return <div>Loading your files...</div>;
    if (error) return <div>Error loading files.</div>;

    return (
        <div>
            <h2>Files and Folders</h2>
            <ul>
                {nodes?.map((node) => (
                    <li key={node.id}>
                        {/* Render file or folder specific UI here */}
                        {node.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
