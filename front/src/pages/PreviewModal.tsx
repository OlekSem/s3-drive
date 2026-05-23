import { useEffect, useState } from 'react';
import { X, Loader2, FileText } from 'lucide-react';
import type { INodeResponse } from "../interfaces.ts";
import API_ENV from "../env";

interface PreviewModalProps {
    isOpen: boolean;
    file: INodeResponse | null;
    onClose: () => void;
}

export default function PreviewModal({ isOpen, file, onClose }: PreviewModalProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [textContent, setTextContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !file || file.type === 'FOLDER') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewUrl(null);
            setTextContent(null);
            return;
        }

        const loadPreview = async () => {
            setLoading(true);
            setError(null);
            setTextContent(null);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_ENV.API_BASE_URL}/api/files/download/${file.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });

                if (!response.ok) throw new Error("Не вдалося завантажити файл для перегляду");

                const mimeType = file.mimeType || '';

                // Якщо це текстовий файл, нам потрібен його вміст у вигляді тексту, а не Blob URL
                if (mimeType.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.md')) {
                    const text = await response.text();
                    setTextContent(text);
                } else {
                    // Для зображень, PDF, аудіо та відео створюємо Object URL
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    setPreviewUrl(url);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Сталася помилка при завантаженні прев'ю");
            } finally {
                setLoading(false);
            }
        };

        loadPreview();

        // Чистимо пам'ять при закритті або зміні файлу
        return () => {
            if (previewUrl) {
                window.URL.revokeObjectURL(previewUrl);
            }
        };
    }, [isOpen, file]);

    // Закриття по Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !file) return null;

    const mimeType = file.mimeType || '';

    // Функція рендеру контенту залежно від типу файлу
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center gap-3 text-white">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="text-sm font-medium opacity-80">Завантаження передперегляду...</p>
                </div>
            );
        }

        if (error) {
            return <div className="text-red-400 font-medium text-sm">{error}</div>;
        }

        // 1. ЗОБРАЖЕННЯ
        if (mimeType.startsWith('image/') && previewUrl) {
            return (
                <img
                    src={previewUrl}
                    alt={file.name}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
            );
        }

        // 2. ВІДЕО
        if (mimeType.startsWith('video/') && previewUrl) {
            return (
                <video src={previewUrl} controls autoPlay className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
            );
        }

        // 3. АУДІО
        if (mimeType.startsWith('audio/') && previewUrl) {
            return (
                <div className="bg-zinc-800 p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 w-80">
                    <FileText className="w-12 h-12 text-blue-400 animate-pulse" />
                    <p className="text-white text-xs truncate w-full text-center font-medium">{file.name}</p>
                    <audio src={previewUrl} controls autoPlay className="w-full" />
                </div>
            );
        }

        // 4. PDF ДОКУМЕНТИ
        if (mimeType === 'application/pdf' && previewUrl) {
            return (
                <iframe
                    src={previewUrl}
                    title={file.name}
                    className="w-[85vw] h-[80vh] rounded-lg border border-zinc-700 shadow-2xl bg-white"
                />
            );
        }

        // 5. ТЕКСТ / КОД
        if (textContent !== null) {
            return (
                <div className="w-[70vw] max-h-[75vh] overflow-auto bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-left font-mono text-xs text-green-400 shadow-2xl leading-relaxed whitespace-pre-wrap">
                    {textContent}
                </div>
            );
        }

        // 6. НЕПІДТРИМУВАНИЙ ТИП (Дефолтний екран)
        return (
            <div className="flex flex-col items-center gap-4 text-center max-w-sm p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <FileText className="w-16 h-16 text-zinc-500" />
                <div>
                    <h4 className="text-white font-semibold text-sm mb-1">{file.name}</h4>
                    <p className="text-zinc-400 text-xs">Попередній перегляд для цього типу файлу (`{mimeType || 'unknown'}`) недоступний.</p>
                </div>
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md select-none p-4"
            onClick={onClose} // Клік на фон закриває модалку
        >
            {/* Хедер модалки */}
            <div
                className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 bg-gradient-to-b from-black/50 to-transparent"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-white">
                    <h2 className="font-semibold text-sm truncate max-w-md">{file.name}</h2>
                    <p className="text-[10px] text-zinc-400">Quick Look режим</p>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
                    title="Закрити (Esc)"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Контентна зона */}
            <div
                className="w-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // Зупиняємо закриття при кліку на сам контент
            >
                {renderContent()}
            </div>
        </div>
    );
}