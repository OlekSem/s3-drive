import React, { useState, useRef } from "react";
import { useUploadFileMutation } from "../service/FileStorageService.ts"; // Adjust path
import { useNavigate, useSearchParams } from "react-router-dom";

const Upload = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get the current folder directory parent context if available (defaults to root if missing)
    const parentIdParam = searchParams.get("id");
    const parentId = parentIdParam ? parseInt(parentIdParam, 10) : undefined;

    // RTK Query file service mutation hook
    const [uploadFile, { isLoading, isSuccess, isError, error }] = useUploadFileMutation();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form submission processing
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        // Build native multipart/form-data container layout payload
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await uploadFile({ parentId, formData }).unwrap();
            setSelectedFile(null);

            // Redirect back to folder view context after a brief success confirmation delay
            setTimeout(() => {
                navigate(parentId ? `/folder?id=${parentId}` : "/");
            }, 1500);
        } catch (err) {
            console.error("Помилка під час завантаження файла:", err);
        }
    };

    // Drag and drop event handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-[var(--surface)] rounded-[20px] border border-[var(--border)] shadow-sm">
            <h1 className="text-2xl font-bold mb-2 text-[var(--text-color)]">Завантаження файлів</h1>
            <p className="text-sm text-gray-400 mb-6">
                {parentId ? `Файл буде завантажено в директорію ID: ${parentId}` : "Файл буде завантажено у кореневу директорію"}
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Drag & Drop Zone Area Wrapper */}
                <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-xl p-10 
                        flex flex-col items-center justify-center 
                        cursor-pointer transition-all duration-200
                        ${isDragActive
                        ? "border-blue-500 bg-blue-500/5 scale-[0.99]"
                        : "border-[var(--border)] hover:bg-[var(--hover-bg)]"
                    }
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />

                    <div className="p-4 bg-[var(--bg)] rounded-full mb-4 text-gray-400">
                        📁
                    </div>

                    {selectedFile ? (
                        <div className="text-center">
                            <p className="text-sm font-semibold text-blue-400 break-all">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-[var(--text-color)]">
                                Перетягніть файл сюди або <span className="text-blue-400 font-semibold">клацніть для огляду</span>
                            </p>
                            <p className="text-xs text-gray-400">Підтримуються всі типи файлів</p>
                        </div>
                    )}
                </div>

                {/* API Status Feedback Badges */}
                {isSuccess && (
                    <div className="p-3 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium">
                        ✓ Файл успішно завантажено в MinIO! Перенаправлення...
                    </div>
                )}

                {isError && (
                    <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                        ✕ Не вдалося завантажити файл. {error && 'status' in error ? `Помилка: ${error.status}` : 'Перевірте мережу.'}
                    </div>
                )}

                {/* Interactive Action Control Line */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition text-[var(--text-color)] disabled:opacity-50"
                    >
                        Скасувати
                    </button>

                    <button
                        type="submit"
                        disabled={!selectedFile || isLoading}
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Завантаження..." : "Надіслати файл"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Upload;
