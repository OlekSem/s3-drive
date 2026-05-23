import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { Folder, File, Trash2, ChevronRight, FileText, Calendar, HardDriveDownload, ArrowLeft, RefreshCw } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.ts';
import type {INodeResponse} from "../interfaces.ts";

export type NodeType = 'FILE' | 'FOLDER';
//
// export interface NodeResponseDto {
//     id: number;
//     name: string;
//     type: NodeType;
//     size: number | null;
//     mimeType: string | null;
//     storageKey: string | null;
//     userId: number;
//     parentId: number | null;
//     createdAt: string;
//     updatedAt: string;
// }

interface FinderProps {
    nodes: INodeResponse[];
    isLoading?: boolean;
    error?: any;
    rootFolderName?: string;
    mode?: 'drive' | 'trash'; // <-- Новий проп для перемикання режимів
    onCreateFolder?: (parentId: number | null) => Promise<void> | void;
    onDeleteNode?: (nodeId: number) => Promise<void> | void; // Для звичайного видалення (в смітник)
    onDeletePermanently?: (nodeId: number) => Promise<void> | void; // <-- Нове
    onRestoreNode?: (nodeId: number) => Promise<void> | void; // <-- Нове
    onDownloadFile?: (file: INodeResponse) => void;
    onUploadClick?: (currentFolderId: number | null) => void;
}

export default function Finder({
                                   nodes = [],
                                   isLoading = false,
                                   error = null,
                                   rootFolderName = "Cloud Space",
                                   mode = 'drive', // За замовчуванням це звичайний диск
                                   onCreateFolder,
                                   onDeleteNode,
                                   onDeletePermanently,
                                   onRestoreNode,
                                   onDownloadFile,
                                   onUploadClick
                               }: FinderProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const folderParam = searchParams.get('id');
    const currentFolderId = folderParam ? parseInt(folderParam, 10) : null;

    const [selectedFile, setSelectedFile] = useState<INodeResponse | null>(null);
    const themeContext = useContext(ThemeContext);
    const isDark = themeContext?.theme === 'dark';

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        visible: boolean;
        targetItem: INodeResponse | null;
    } | null>(null);

    useEffect(() => {
        const closeMenu = () => {
            if (contextMenu?.visible) setContextMenu(prev => prev ? { ...prev, visible: false } : null);
        };
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent, item: INodeResponse | null) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true, targetItem: item });
    };

    const colors = {
        bg: isDark ? 'bg-[#1e1e24] border-[#2a2a35] text-[#f5f5f7]' : 'bg-white border-gray-200 text-gray-900',
        body: isDark ? 'bg-[#1a1a1f]' : 'bg-gray-50/50',
        header: isDark ? 'bg-[#16161b] border-[#2a2a32]' : 'bg-gray-100/70 border-gray-200',
        textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
        textLabel: isDark ? 'text-gray-400' : 'text-gray-500',
        itemHover: isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-200/70',
        badgeBg: isDark ? 'bg-[#2e2e38] border-gray-600' : 'bg-gray-200 border-gray-300',
        inspector: isDark ? 'bg-[#15151a] border-[#2a2a32]' : 'bg-white border-gray-200',
        previewContainer: isDark ? 'bg-[#262630] border-[#2a2a35]' : 'bg-gray-50 border-gray-200',
        codeBg: isDark ? 'bg-[#24242e] text-blue-400 border-[#2e2e3a]' : 'bg-gray-50 text-blue-600 border-gray-200',
        divider: isDark ? 'bg-zinc-800' : 'bg-gray-200'
    };

    const getBreadcrumbs = (): INodeResponse[] => {
        const path: INodeResponse[] = [];
        let currentId = currentFolderId;
        while (currentId !== null) {
            const folder = nodes.find(n => n.id === currentId);
            if (folder) {
                path.unshift(folder);
                currentId = folder.parentId;
            } else {
                break;
            }
        }
        return path;
    };

    const getCurrentItems = () => {
        if (currentFolderId !== null) {
            return nodes.filter(n => n.parentId === currentFolderId);
        }
        return nodes.filter(n => n.parentId === null);
    };

    const navigateToFolder = (id: number | null) => {
        if (id === null) {
            searchParams.delete('id');
        } else {
            searchParams.set('id', id.toString());
        }
        setSearchParams(searchParams);
        setSelectedFile(null);
    };

    const handleItemClick = (item: INodeResponse) => {
        if (item.type === 'FOLDER') {
            navigateToFolder(item.id);
        } else {
            setSelectedFile(selectedFile?.id === item.id ? null : item);
        }
    };

    const formatBytes = (bytes: number | null) => {
        if (bytes === null) return '--';
        if (bytes < 1024) return `${bytes} B`;
        const kib = bytes / 1024;
        if (kib < 1024) return `${kib.toFixed(1)} KB`;
        return `${(kib / 1024).toFixed(1)} MB`;
    };

    if (isLoading) return <div className="p-6 text-center font-medium text-sm">Loading Files...</div>;
    if (error) return <div className="p-6 text-center text-red-500 font-medium text-sm">Error loading files.</div>;

    const activeItems = getCurrentItems();
    const breadcrumbs = getBreadcrumbs();

    return (
        <div onContextMenu={(e) => handleContextMenu(e, null)}
             className={`flex w-full h-[580px] font-sans rounded-xl overflow-hidden shadow-2xl border transition-colors duration-200 ${colors.bg}`}>

            {/* ОСНОВНА ПАНЕЛЬ ЕКСПЛОРЕРА */}
            <div className={`flex-1 flex flex-col min-w-0 ${colors.body}`}>

                {/* ХЛІБНІ КРИХТИ */}
                <header className={`h-12 border-b px-4 flex items-center gap-3 select-none flex-shrink-0 ${colors.header}`}>
                    {currentFolderId !== null && (
                        <button
                            onClick={() => {
                                const parentFolder = nodes.find(n => n.id === currentFolderId);
                                navigateToFolder(parentFolder ? parentFolder.parentId : null);
                            }}
                            className={`p-1 rounded-md transition-colors ${colors.textLabel} ${colors.itemHover}`}
                        >
                            <ArrowLeft size={16} />
                        </button>
                    )}

                    <div className={`flex items-center gap-1.5 text-xs font-medium overflow-x-auto whitespace-nowrap ${colors.textLabel}`}>
                        <span onClick={() => navigateToFolder(null)} className="hover:text-blue-500 cursor-pointer">
                            {mode === 'trash' ? 'Trash Bin' : rootFolderName}
                        </span>
                        {breadcrumbs.map((folder, index) => (
                            <React.Fragment key={folder.id}>
                                <ChevronRight size={12} className="opacity-50 flex-shrink-0" />
                                <span
                                    onClick={() => navigateToFolder(folder.id)}
                                    className={`cursor-pointer ${index === breadcrumbs.length - 1 ? 'text-blue-500 font-semibold' : 'hover:text-blue-400'}`}
                                >
                                    {folder.name}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </header>

                {/* СІТКА ЕЛЕМЕНТІВ */}
                <main className="flex-1 p-6 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-6 content-start auto-rows-max">
                    {activeItems.length === 0 ? (
                        <div className={`col-span-full text-center py-20 font-medium italic text-sm ${colors.textMuted}`}>
                            {mode === 'trash' ? 'Trash is empty' : 'Empty folder'}
                        </div>
                    ) : (
                        activeItems.map(item => {
                            const isFileSelected = selectedFile?.id === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    onContextMenu={(e) => handleContextMenu(e, item)}
                                    className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-150 group select-none ${
                                        isFileSelected ? 'bg-blue-500/20 ring-2 ring-blue-500' : colors.itemHover
                                    }`}
                                >
                                    <div className="w-16 h-16 flex items-center justify-center mb-2 relative">
                                        {item.type === 'FOLDER' ? (
                                            <Folder className={`w-14 h-14 drop-shadow-md transition-transform group-hover:scale-105 ${
                                                isFileSelected ? 'text-blue-600' : 'text-blue-500'
                                            }`} fill="currentColor" fillOpacity={0.15} />
                                        ) : (
                                            <div className="relative">
                                                <File className={`w-12 h-12 drop-shadow-md transition-transform group-hover:scale-105 ${
                                                    isFileSelected ? 'text-blue-500' : 'text-gray-400'
                                                }`} fill="currentColor" fillOpacity={0.1} />
                                                <span className={`absolute bottom-1 left-1 border text-[8px] font-bold px-1 py-0.2 rounded uppercase tracking-tight scale-90 group-hover:text-blue-500 transition-colors ${colors.badgeBg} ${colors.textLabel}`}>
                                                    {item.name.split('.').pop() || 'data'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-center w-full break-words line-clamp-2 px-1 font-medium leading-tight">
                                        {item.name}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </main>
            </div>

            {/* ІНСПЕКТОР ФАЙЛІВ Справа */}
            {selectedFile && (
                <aside className={`w-[260px] border-l p-6 flex flex-col items-center flex-shrink-0 select-none ${colors.inspector}`}>
                    <div className={`p-5 rounded-2xl border mb-4 ${colors.previewContainer}`}>
                        <FileText size={48} className="text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-sm text-center w-full truncate px-2 mb-2">{selectedFile.name}</h3>
                    <div className={`w-full h-px my-2 ${colors.divider}`} />
                    <div className="w-full flex flex-col gap-3 text-[11px] mt-2">
                        <div className="flex justify-between">
                            <span className={colors.textLabel}>Kind</span>
                            <span className="truncate max-w-[140px] font-medium">{selectedFile.mimeType || 'Generic Object'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className={colors.textLabel}>Size</span>
                            <span className="font-medium">{formatBytes(selectedFile.size)}</span>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                            <span className={`flex items-center gap-1 font-medium ${colors.textLabel}`}><HardDriveDownload size={12}/> MinIO Key</span>
                            <code className={`p-2 rounded-md font-mono text-[10px] break-all leading-tight border ${colors.codeBg}`}>
                                {selectedFile.storageKey}
                            </code>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className={`flex items-center gap-1 ${colors.textLabel}`}><Calendar size={12}/> Modified</span>
                            <span className="font-medium">{new Date(selectedFile.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </aside>
            )}

            {/* КОНТЕКСТНЕ МЕНЮ — ДИНАМІЧНЕ ЗАЛЕЖНО ВІД MODE */}
            {contextMenu && contextMenu.visible && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className={`fixed z-50 w-48 py-1 rounded-lg shadow-xl border text-xs select-none backdrop-blur-md ${
                        isDark ? 'bg-[#1b1b22]/95 border-[#2c2c3a] text-gray-200' : 'bg-white/95 border-gray-200 text-gray-800'
                    }`}
                >
                    {contextMenu.targetItem ? (
                        <>
                            <div className="px-3 py-1.5 font-semibold opacity-50 truncate border-b border-current/10">
                                {contextMenu.targetItem.name}
                            </div>

                            {/* Якщо ми в СМІТНИКУ */}
                            {mode === 'trash' ? (
                                <>
                                    {onRestoreNode && (
                                        <button
                                            onClick={() => onRestoreNode!(contextMenu.targetItem!.id)}
                                            className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${isDark ? 'hover:bg-blue-600/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                                        >
                                            <RefreshCw size={12} /> Restore Item
                                        </button>
                                    )}
                                    <div className={`h-px my-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                                    {onDeletePermanently && (
                                        <button
                                            onClick={() => onDeletePermanently!(contextMenu.targetItem!.id)}
                                            className="w-full text-left px-3 py-2 text-red-500 font-semibold hover:bg-red-500/10 transition-colors"
                                        >
                                            Delete permanently
                                        </button>
                                    )}
                                </>
                            ) : (
                                /* Якщо ми на звичайному ДИСКУ */
                                <>
                                    <button onClick={() => handleItemClick(contextMenu.targetItem!)} className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}>
                                        {contextMenu.targetItem.type === 'FOLDER' ? 'Open Folder' : 'Select File'}
                                    </button>
                                    {onDownloadFile && (
                                        <button onClick={() => onDownloadFile(contextMenu.targetItem!)} className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}>
                                            Download
                                        </button>
                                    )}
                                    <div className={`h-px my-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                                    {onDeleteNode && (
                                        <button onClick={() => onDeleteNode(contextMenu.targetItem!.id)} className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-500/10 transition-colors">
                                            Move to Trash
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        /* Натискання на порожнє місце (показуємо створення тільки на диску) */
                        mode === 'drive' && (
                            <>
                                {onCreateFolder && <button onClick={() => onCreateFolder(currentFolderId)} className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}>New Folder</button>}
                                {onUploadClick && <button onClick={() => onUploadClick(currentFolderId)} className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}>Upload Files Here</button>}
                            </>
                        )
                    )}
                </div>
            )}
        </div>
    );
}