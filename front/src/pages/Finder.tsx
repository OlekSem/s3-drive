import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { useGetFolderViewQuery, useCreateFolderMutation } from "../service/FileStorageService.ts";
import { Folder, File, Trash2, HardDrive, ChevronRight, FileText, Calendar, HardDriveDownload, ArrowLeft } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.ts';

export type NodeType = 'FILE' | 'FOLDER';

export interface NodeResponseDto {
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

export default function Finder() {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Читаємо ID папки з URL. Якщо немає — залишаємо null для сумісності з іншим кодом
    const folderParam = searchParams.get('id');
    const currentFolderId = folderParam ? parseInt(folderParam, 10) : null;

    const [currentView, setCurrentView] = useState<'DRIVE' | 'TRASH'>('DRIVE');
    const [selectedFile, setSelectedFile] = useState<NodeResponseDto | null>(null);

// 2. ПЕРЕДАЄМО ОБ'ЄКТ: замість чистого ID передаємо { folderId: ... }
// Якщо currentFolderId === null, передаємо undefined, щоб params на бекенд не йшли
    const { data: nodes = [], error, isLoading } = useGetFolderViewQuery({
        folderId: currentFolderId !== null ? currentFolderId : undefined
    });
    const [createFolder, { isLoading: isCreating }] = useCreateFolderMutation();

    const themeContext = useContext(ThemeContext);
    const isDark = themeContext?.theme === 'dark';

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        visible: boolean;
        targetItem: NodeResponseDto | null;
    } | null>(null);

    useEffect(() => {
        const closeMenu = () => {
            if (contextMenu?.visible) {
                setContextMenu(prev => prev ? { ...prev, visible: false } : null);
            }
        };
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent, item: NodeResponseDto | null) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            targetItem: item
        });
    };

    const handleCreateFolder = async () => {
        console.log('Create folder');
        try {
            await createFolder({
                parentId: currentFolderId !== null ? currentFolderId : undefined
            }).unwrap();

        } catch (err) {
            console.error("Failed to create folder:", err);
            alert("Failed to create folder");
        }
    };

    const colors = {
        bg: isDark ? 'bg-[#1e1e24] border-[#2a2a35] text-[#f5f5f7]' : 'bg-white border-gray-200 text-gray-900',
        sidebar: isDark ? 'bg-[#141417] border-[#2a2a32]' : 'bg-gray-50 border-gray-200',
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

    // 3. Побудова хлібних крихт на основі масиву, який повернув сервер
    const getBreadcrumbs = (): NodeResponseDto[] => {
        const path: NodeResponseDto[] = [];
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

    // 4. Фільтрація елементів відповідно до поточного ID в URL
    const getCurrentItems = () => {
        if (currentFolderId !== null) {
            return nodes.filter(n => n.parentId === currentFolderId);
        }
        if (currentView === 'TRASH') {
            // Для смітника: фільтруємо за логікою вашої бізнес-моделі (наприклад, id 6 або 7, або поля isDeleted)
            return nodes.filter(n => n.id === 6 || n.id === 7);
        }
        // Корінь: показуємо тільки ті елементи, у яких немає parentId
        return nodes.filter(n => n.parentId === null && n.id !== 6 && n.id !== 7);
    };

    // 5. Навігація через оновлення параметрів URL
    const navigateToFolder = (id: number | null) => {
        if (id === null) {
            searchParams.delete('id');
        } else {
            searchParams.set('id', id.toString());
        }
        setSearchParams(searchParams);
        setSelectedFile(null);
    };

    const handleItemClick = (item: NodeResponseDto) => {
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

    if (isLoading) return <div className="p-6 text-center font-medium">Loading your files...</div>;
    if (error) return <div className="p-6 text-center text-red-500 font-medium">Error loading files.</div>;

    const activeItems = getCurrentItems();
    const breadcrumbs = getBreadcrumbs();

    return (
        <div onContextMenu={(e) => handleContextMenu(e, null)}
             className={`flex w-full h-[580px] font-sans rounded-xl overflow-hidden shadow-2xl border transition-colors duration-200 ${colors.bg}`}>

            {/* SIDEBAR NAVIGATION */}
            <aside className={`w-[200px] p-4 border-r flex flex-col gap-4 select-none ${colors.sidebar}`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 ${colors.textMuted}`}>
                    Locations
                </span>
                <nav className="flex flex-col gap-1">
                    <button
                        onClick={() => { setCurrentView('DRIVE'); navigateToFolder(null); }}
                        className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors duration-150 ${
                            currentView === 'DRIVE' && currentFolderId === null
                                ? 'bg-blue-600 text-white shadow-sm'
                                : `hover:text-current ${colors.textLabel} ${colors.itemHover}`
                        }`}
                    >
                        <HardDrive size={16} className={currentView === 'DRIVE' && currentFolderId === null ? 'text-white' : 'text-blue-500'} />
                        My Drive
                    </button>
                    <button
                        onClick={() => { setCurrentView('TRASH'); navigateToFolder(null); }}
                        className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors duration-150 ${
                            currentView === 'TRASH'
                                ? 'bg-red-600 text-white shadow-sm'
                                : `hover:text-current ${colors.textLabel} ${colors.itemHover}`
                        }`}
                    >
                        <Trash2 size={16} className={currentView === 'TRASH' ? 'text-white' : 'text-red-500'} />
                        Trash Bin
                    </button>
                </nav>
            </aside>

            {/* ICON GRID PLATFORM FIELD */}
            <div className={`flex-1 flex flex-col min-w-0 ${colors.body}`}>

                {/* NAV BAR HEADER BREADCRUMBS */}
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
                        <span
                            onClick={() => navigateToFolder(null)}
                            className="hover:text-blue-500 cursor-pointer"
                        >
                            {currentView === 'DRIVE' ? 'My Drive' : 'Trash Bin'}
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

                {/* ICON CONTAINER GRID LAYOUT */}
                <main className="flex-1 p-6 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-6 content-start auto-rows-max">
                    {activeItems.length === 0 ? (
                        <div className={`col-span-full text-center py-20 font-medium italic text-sm ${colors.textMuted}`}>
                            Empty folder
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
                                        isFileSelected
                                            ? 'bg-blue-500/20 ring-2 ring-blue-500'
                                            : colors.itemHover
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

            {/* METADATA SIDE INSPECTOR CONTEXT WINDOW */}
            {selectedFile && (
                <aside className={`w-[260px] border-l p-6 flex flex-col items-center flex-shrink-0 select-none animate-fadeIn ${colors.inspector}`}>
                    <div className={`p-5 rounded-2xl border mb-4 ${colors.previewContainer}`}>
                        <FileText size={48} className="text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-sm text-center w-full truncate px-2 mb-2" title={selectedFile.name}>
                        {selectedFile.name}
                    </h3>
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

            {/* FLOATING CONTEXT MENU */}
            {contextMenu && contextMenu.visible && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className={`fixed z-50 w-48 py-1 rounded-lg shadow-xl border text-xs select-none backdrop-blur-md animate-fadeIn ${
                        isDark
                            ? 'bg-[#1b1b22]/95 border-[#2c2c3a] text-gray-200'
                            : 'bg-white/95 border-gray-200 text-gray-800'
                    }`}
                >
                    {contextMenu.targetItem ? (
                        <>
                            <div className="px-3 py-1.5 font-semibold opacity-50 truncate border-b border-current/10">
                                {contextMenu.targetItem.name}
                            </div>
                            <button
                                onClick={() => handleItemClick(contextMenu.targetItem!)}
                                className={`w-full text-left px-3 py-2 transition-colors ${isDark ? 'hover:bg-blue-600/30 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                            >
                                {contextMenu.targetItem.type === 'FOLDER' ? 'Open Folder' : 'Select File'}
                            </button>
                            <button
                                onClick={() => alert(`Downloading S3 Key: ${contextMenu.targetItem?.storageKey}`)}
                                className={`w-full text-left px-3 py-2 transition-colors ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}
                            >
                                Download
                            </button>
                            <div className={`h-px my-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                            <button
                                onClick={() => alert(`Moving item ${contextMenu.targetItem?.id} to Trash`)}
                                className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                Delete permanently
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleCreateFolder()}
                                className={`w-full text-left px-3 py-2 transition-colors ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}
                            >
                                New Folder
                            </button>
                            <button
                                onClick={() => alert('Opening local S3 upload dialog...')}
                                className={`w-full text-left px-3 py-2 transition-colors ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}
                            >
                                Upload Files Here
                            </button>
                            <div className={`h-px my-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                            <button
                                onClick={() => navigateToFolder(null)}
                                className={`w-full text-left px-3 py-2 transition-colors ${isDark ? 'hover:bg-[#25252e]' : 'hover:bg-gray-100'}`}
                            >
                                Go to Root Directory
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}