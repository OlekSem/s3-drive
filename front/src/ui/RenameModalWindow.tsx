import * as Yup from "yup";
import type { FC } from "react";
import UniversalForm from "./UniversalForm.tsx";
import FormikInput from "./FormikInput.tsx";

interface RenameModalWindowProps {
    isOpen: boolean;
    currentName: string;
    onConfirm: (newName: string) => void;
    closeModal: () => void;
}

type RenameFormValues = Record<string, string> & {
    name: string;
}

const validationSchema = Yup.object({
    name: Yup.string()
        .min(1, "Назва не може бути порожньою")
        .required("Назва обов'язкова"),
});

const RenameModalWindow: FC<RenameModalWindowProps> = ({
                                                           isOpen,
                                                           currentName,
                                                           onConfirm,
                                                           closeModal,
                                                       }) => {
    if (!isOpen) return null;

    const handleSubmit = (values: RenameFormValues) => {
        onConfirm(values.name);
        closeModal();
    };

    return (
        <div className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/45
            px-4
        ">
            <div className="
                relative
                w-full max-w-md
                rounded-[20px]
                bg-[var(--surface)]
                border border-[var(--border)]
                p-7
                animate-in fade-in zoom-in-95
            ">
                <button
                    onClick={closeModal}
                    type="button"
                    className="
                        absolute right-4 top-4
                        flex items-center justify-center
                        w-8 h-8
                        rounded-lg
                        border border-[var(--border)]
                        text-[#5F5E5A]
                        hover:bg-[var(--hover-bg)]
                        transition-colors
                    "
                >
                    ✕
                </button>

                <UniversalForm
                    initialValues={{ name: currentName }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    title="Перейменувати"
                    subtitle="Введіть нову назву"
                    submitLabel="Зберегти"
                >
                    <FormikInput<RenameFormValues>
                        name="name"
                        label="Назва"
                        type="text"
                        placeholder="Нова назва..."
                    />
                </UniversalForm>
            </div>
        </div>
    );
};

export default RenameModalWindow;