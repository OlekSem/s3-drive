import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import {
    X, Folder, File, ChevronRight, FileText, Calendar,
    HardDriveDownload, ArrowLeft, RefreshCw, Check, Trash2
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.ts';
import type { INodeResponse } from "../interfaces.ts";
import API_ENV from "../env";
import RenameModalWindow from "../ui/RenameModalWindow.tsx";
import PreviewModal from "./PreviewModal.tsx";
import {fileStorageApi} from "../service/FileStorageService.ts";

export type NodeType = 'FILE' | 'FOLDER';

interface FinderProps {
    nodes: INodeResponse[];
    isLoading?: boolean;
    error?: never;
    rootFolderName?: string;
    mode?: 'drive' | 'trash';
    onCreateFolder?: (parentId: number | null) => Promise<void> | void;
    onDeleteNode?: (nodeIds: number[]) => Promise<void> | void;
    onDeletePermanently?: (nodeIds: number[]) => Promise<void> | void;
    onRestoreNode?: (nodeIds: number[]) => Promise<void> | void;
    onDownloadFile?: (file: INodeResponse) => void;
    onRenameNode?: (id: number, newName: string) => Promise<void>;
    onUploadClick?: (currentFolderId: number | null) => void;
}

export default function Finder({
                                   nodes = [],
                                   rootFolderName = "Cloud Space",
                                   mode = 'drive',
                                   onCreateFolder,
                                   onDeleteNode,
                                   onDeletePermanently,
                                   onRenameNode,
                                   onUploadClick
                               }: FinderProps) {
    const [previewTarget, setPreviewTarget] = useState<INodeResponse | null>(null);
    const inspectorRef = useRef<HTMLDivElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const folderParam = searchParams.get('id');
    const currentFolderId = folderParam ? parseInt(folderParam, 10) : null;

    const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
    const [activeInspectorItem, setActiveInspectorItem] = useState<INodeResponse | null>(null);

    const themeContext = useContext(ThemeContext);
    const isDark = themeContext?.theme === 'dark';
    const [isDownloading, setIsDownloading] = useState(false);
    const [renameTarget, setRenameTarget] = useState<INodeResponse | null>(null);

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        visible: boolean;
        targetItem: INodeResponse | null;
    } | null>(null);

    const selectedCount = Object.keys(selectedIds).filter(id => selectedIds[parseInt(id, 10)]).length;

    useEffect(() => {
        const handleWindowClick = (e: MouseEvent) => {
            if (e.button !== 0) return; // Реагуємо тільки на ліву кнопку миші
            const clickedInsideMenu = (e.target as HTMLElement).closest('.context-menu-wrapper');
            if (clickedInsideMenu) return;
            setContextMenu(null);
        };

        if (contextMenu?.visible) {
            window.addEventListener('click', handleWindowClick);
        }
        return () => window.removeEventListener('click', handleWindowClick);
    }, [contextMenu?.visible]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inspectorRef.current && inspectorRef.current.contains(event.target as Node)) return;

            const clickedInsideMenu = (event.target as HTMLElement).closest('.context-menu-wrapper');
            if (clickedInsideMenu) return;

            const clickedOnItem = (event.target as HTMLElement).closest('.finder-node-item');
            if (!clickedOnItem) {
                setSelectedIds({});
                setActiveInspectorItem(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSelectedIds({});
        setActiveInspectorItem(null);
    }, [currentFolderId]);

    const handleContextMenu = (e: React.MouseEvent, item: INodeResponse | null) => {
        e.preventDefault();
        e.stopPropagation();

        if (item && !selectedIds[item.id]) {
            setSelectedIds({ [item.id]: true });
        }

        setContextMenu({ x: e.clientX, y: e.clientY, visible: true, targetItem: item });
    };

    const handleDownload = async (file: INodeResponse) => {
        try {
            setIsDownloading(true);
            // 1. Fetch the data directly from your backend endpoint
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_ENV.API_BASE_URL}/api/files/download/${file.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            // 2. Extract the file as a raw blob stream directly into browser memory
            const blobData = await response.blob();

            // 3. Create a temporary local object pointer URL
            const downloadUrl = window.URL.createObjectURL(blobData);

            // 4. Trigger the native browser save file dialog box
            const anchorLink = document.createElement('a');
            anchorLink.href = downloadUrl;
            anchorLink.download = file.name; // Preserves your filename extension
            document.body.appendChild(anchorLink);
            anchorLink.click();

            // 5. Instantly clean up DOM nodes and release the file memory stream
            document.body.removeChild(anchorLink);
            window.URL.revokeObjectURL(downloadUrl);

        } catch (err) {
            console.error("Failed to download file directly:", err);
        } finally {
            setIsDownloading(false);
        }
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
        divider: isDark ? 'bg-zinc-800' : 'bg-gray-200',
        checkboxBorder: isDark ? 'border-gray-600 bg-[#1e1e24]' : 'border-gray-300 bg-white'
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
    };

    const handleToggleSelect = (e: React.MouseEvent, item: INodeResponse) => {
        e.stopPropagation();
        setSelectedIds(prev => {
            const updated = { ...prev };
            if (updated[item.id]) {
                delete updated[item.id];
                if (activeInspectorItem?.id === item.id) {
                    setActiveInspectorItem(null);
                }
            } else {
                updated[item.id] = true;
            }
            return updated;
        });
    };

    const handleItemClick = (item: INodeResponse) => {
        if (item.type === 'FOLDER') {
            navigateToFolder(item.id);
        } else {
            setActiveInspectorItem(item);
        }
    };

    const handleItemDoubleClick = (item: INodeResponse) => {
        if (item.type === 'FOLDER') {
            navigateToFolder(item.id);
        } else {
            setPreviewTarget(item);
        }
    };

    const getTargetIds = (targetItem: INodeResponse | null): number[] => {
        const currentSelected = Object.keys(selectedIds)
            .map(id => parseInt(id, 10))
            .filter(id => !!selectedIds[id]);

        if (currentSelected.length > 0) {
            return currentSelected;
        }
        return targetItem ? [targetItem.id] : [];
    };

    const [restore] = fileStorageApi.useRestoreNodeMutation()

    const formatBytes = (bytes: number | null) => {
        if (bytes === null) return '--';
        if (bytes < 1024) return `${bytes} B`;
        const kib = bytes / 1024;
        if (kib < 1024) return `${kib.toFixed(1)} KB`;
        return `${(kib / 1024).toFixed(1)} MB`;
    };

    // if (isLoading) return <div className="p-6 text-center font-medium text-sm">Loading Files...</div>;
    // if (error) return <div className="p-6 text-center text-red-500 font-medium text-sm">Error loading files.</div>;

    const activeItems = getCurrentItems();
    const breadcrumbs = getBreadcrumbs();

    return (
        <>
            {/* h-full та min-h-[600px] замість жорсткого h-[580px] розширюють вікно */}
            <div onContextMenu={(e) => handleContextMenu(e, null)}
                 className={`flex w-full min-h-[640px] h-full font-sans rounded-xl overflow-hidden shadow-2xl border transition-colors duration-200 ${colors.bg}`}>

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

                    {/* СІТКА ЕЛЕМЕНТІВ — Now a Flex Container */}
                    {/* This centers the entire grid system horizontally */}
                    <main className="flex-1 p-6 overflow-y-auto flex flex-wrap justify-start gap-4 content-start">

                    {activeItems.length === 0 ? (
                            <div className={`w-full text-center py-20 font-medium italic text-sm ${colors.textMuted}`}>
                                {mode === 'trash' ? 'Trash is empty' : 'Empty folder'}
                            </div>
                        ) : (
                            activeItems.map(item => {
                                const isItemChecked = !!selectedIds[item.id];

                                return (
                                    <div
                                        key={item.id}
                                        onContextMenu={(e) => handleContextMenu(e, item)}
                                        // onClick={() => handleItemClick(item)}
                                        onDoubleClick={() => handleItemDoubleClick(item)}
                                        /*
                                          CHANGES MADE HERE:
                                          - Added 'w-28' (112px) to give items a completely static, unyielding width.
                                          - Added 'flex-shrink-0' to guarantee the browser never compresses the file item size.
                                        */
                                        className={`flex flex-col items-center p-3 w-28 flex-shrink-0 rounded-xl cursor-pointer transition-all duration-150 group select-none finder-node-item relative ${
                                            isItemChecked ? 'bg-blue-500/20 ring-2 ring-blue-500' : colors.itemHover
                                        }`}
                                    >
                                        <div className="w-16 h-16 flex items-center justify-center mb-2 relative">
                                            {item.type === 'FOLDER' ? (
                                                <Folder className={`w-14 h-14 drop-shadow-md transition-transform group-hover:scale-105 ${
                                                    isItemChecked ? 'text-blue-600' : 'text-blue-500'
                                                }`} fill="currentColor" fillOpacity={0.15}
                                                />
                                            ) : (
                                                <div className="relative">
                                                    <File className={`w-12 h-12 drop-shadow-md transition-transform group-hover:scale-105 ${
                                                        isItemChecked ? 'text-blue-500' : 'text-gray-400'
                                                    }`} fill="currentColor" fillOpacity={0.1} />
                                                    <span className={`absolute bottom-1 left-1 border text-[8px] font-bold px-1 py-0.2 rounded uppercase tracking-tight scale-90 group-hover:text-blue-500 transition-colors ${colors.badgeBg} ${colors.textLabel}`}>
                                    {item.name.split('.').pop() || 'data'}
                                </span>
                                                </div>
                                            )}

                                            <div
                                                onClick={(e) => handleToggleSelect(e, item)}
                                                className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-150 shadow-sm z-10 ${
                                                    isItemChecked
                                                        ? 'bg-blue-500 border-blue-600 text-white opacity-100 scale-100'
                                                        : `${colors.checkboxBorder} opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:border-blue-500 hover:scale-110`
                                                }`}
                                            >
                                                {isItemChecked && <Check size={12} strokeWidth={3} />}
                                            </div>
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

                {/* ІНСПЕКТОР ФАЙЛІВ */}
                {activeInspectorItem && (
                    <aside ref={inspectorRef}
                           className={`relative w-[260px] border-l p-6 flex flex-col items-center flex-shrink-0 select-none ${colors.inspector}`}>

                        <button
                            onClick={() => setActiveInspectorItem(null)}
                            className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10 ${colors.textLabel}`}
                            title="Close details"
                        >
                            <X size={16} />
                        </button>

                        <div className={`p-5 rounded-2xl border mb-4 mt-4 ${colors.previewContainer}`}>
                            <FileText size={48} className="text-blue-500" />
                        </div>

                        <h3 className="font-semibold text-sm text-center w-full truncate px-2 mb-2">{activeInspectorItem.name}</h3>

                        <div className={`w-full h-px my-2 ${colors.divider}`} />

                        <div className="w-full flex flex-col gap-3 text-[11px] mt-2">
                            <div className="flex justify-between">
                                <span className={colors.textLabel}>Kind</span>
                                <span className="truncate max-w-[140px] font-medium">{activeInspectorItem.mimeType || 'Generic Object'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={colors.textLabel}>Size</span>
                                <span className="font-medium">{formatBytes(activeInspectorItem.size)}</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                                <span className={`flex items-center gap-1 font-medium ${colors.textLabel}`}><HardDriveDownload size={12}/> MinIO Key</span>
                                <code className={`p-2 rounded-md font-mono text-[10px] break-all leading-tight border ${colors.codeBg}`}>
                                    {activeInspectorItem.storageKey}
                                </code>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className={`flex items-center gap-1 ${colors.textLabel}`}><Calendar size={12}/> Modified</span>
                                <span className="font-medium">{new Date(activeInspectorItem.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </aside>
                )}

                {/* КОНТЕКСТНЕ МЕНЮ */}
                {contextMenu && contextMenu.visible && (
                    <div
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        className={`fixed z-50 w-52 py-1 rounded-lg shadow-xl border text-xs select-none backdrop-blur-md context-menu-wrapper ${
                            !contextMenu.targetItem && mode === 'trash' ? 'hidden' : ''
                        } ${
                            isDark ? 'bg-[#1b1b22]/95 border-[#2c2c3a] text-gray-200' : 'bg-white/95 border-gray-200 text-gray-800'
                        }`}
                    >
                        {contextMenu.targetItem ? (
                            <>
                                <div className="px-3 py-1.5 font-semibold opacity-50 truncate border-b border-current/10">
                                    {selectedCount > 1 ? `Selected ${selectedCount} items` : contextMenu.targetItem.name}
                                </div>

                                {/* Якщо ми в СМІТНИКУ */}
                                {mode === 'trash' ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                restore(getTargetIds(contextMenu.targetItem));
                                                setSelectedIds({});
                                                setContextMenu(null);
                                            }}
                                            className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${isDark ? 'hover:bg-blue-600/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                                        >
                                            <RefreshCw size={12} /> {selectedCount > 1 ? `Restore ${selectedCount} items` : 'Restore'}
                                        </button>
                                        <div className={`h-px my-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                                        {onDeletePermanently && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const ids = getTargetIds(contextMenu.targetItem);
                                                    onDeletePermanently(ids);
                                                    setSelectedIds({});
                                                    setContextMenu(null);
                                                }}
                                                className="w-full text-left px-3 py-2 text-red-500 font-semibold hover:bg-red-500/10 transition-colors"
                                            >
                                                {selectedCount > 1 ? `Delete ${selectedCount} items permanently` : 'Delete permanently'}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    /* Якщо ми на звичайному ДИСКУ */
                                    <>
                                        {/* ГВАРД БЛОКУВАННЯ: Приховує одиночні дії, якщо вибрано декілька елементів */}
                                        {selectedCount <= 1 && (
                                            <>
                                                <button onClick={() => handleItemClick(contextMenu.targetItem!)}
                                                        className={`w-full text-left px-3 py-2 text-xs font-medium ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}>
                                                    {contextMenu.targetItem!.type === 'FOLDER' ? 'Open Folder' : 'Select File'}
                                                </button>

                                                {contextMenu.targetItem!.type === 'FILE' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(contextMenu.targetItem!);
                                                            setContextMenu(null);
                                                        }}
                                                        disabled={isDownloading}
                                                        className={`w-full text-left px-3 py-2 text-xs font-medium ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'} disabled:opacity-50`}
                                                    >
                                                        {isDownloading ? "Downloading..." : "Download"}
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        handleItemClick(contextMenu.targetItem!);
                                                        setContextMenu(null);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-xs font-medium ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}
                                                >
                                                    Get Info
                                                </button>

                                                <div className={`h-px my-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />

                                                {onRenameNode && (
                                                    <button
                                                        onClick={() => {
                                                            setRenameTarget(contextMenu.targetItem);
                                                            setContextMenu(null);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 text-xs font-medium ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}
                                                    >
                                                        Rename
                                                    </button>
                                                )}

                                                <div className={`h-px my-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                                            </>
                                        )}

                                        {/* Ця дія завжди доступна і для одного, і для багатьох елементів */}
                                        {onDeleteNode && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const idsToDelete = getTargetIds(contextMenu.targetItem);
                                                    onDeleteNode(idsToDelete);
                                                    setSelectedIds({});
                                                    setContextMenu(null);
                                                }}
                                                className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                                            >
                                                <Trash2 size={12} /> {selectedCount > 1 ? `Move ${selectedCount} items to Trash` : 'Move to Trash'}
                                            </button>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            /* Натискання на порожнє місце (показуємо створення тільки на диску) */
                            mode === 'drive' && (
                                <>
                                    {onCreateFolder && (
                                        <button onClick={() => { onCreateFolder(currentFolderId); setContextMenu(null); }}
                                                className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}>
                                            New Folder
                                        </button>
                                    )}
                                    {onUploadClick && (
                                        <button onClick={() => { onUploadClick(currentFolderId); setContextMenu(null); }}
                                                className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}>
                                            Upload File
                                        </button>
                                    )}
                                </>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Модалка прев'ю викликається тут, окремо від дерева умов контекстного меню */}
            <PreviewModal
                isOpen={!!previewTarget}
                file={previewTarget}
                onClose={() => setPreviewTarget(null)}
            />

            {onRenameNode && (
                <RenameModalWindow
                    isOpen={!!renameTarget}
                    currentName={renameTarget?.name ?? ""}
                    onConfirm={async (newName) => {
                        await onRenameNode(renameTarget!.id, newName);
                        setRenameTarget(null);
                    }}

                    closeModal={() => setRenameTarget(null)}
                />
            )}
        </>
    );
}