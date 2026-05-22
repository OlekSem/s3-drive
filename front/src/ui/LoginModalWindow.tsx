import * as Yup from "yup";
import type {FC} from "react";
import UniversalForm from "./UniversalForm.tsx";
import FormikInput from "./FormikInput.tsx";
import type ILoginModel from "../models/ILoginModel.ts";
import {authService} from "../service/AuthService.ts";




type LoginTextValues = Omit<ILoginModel, "avatar">;
const initialValues: ILoginModel = {
    email: "",
    password: "",
};
const validationSchema = Yup.object({
    email: Yup.string().email("Введіть коректний email").required("Email обов'язковий"),
    password: Yup.string().min(6, "Мінімум 6 символів").required("Пароль обов'язковий"),
});
interface ModalWindowProps {
    isOpen: boolean;
    closeModal: () => void;
}

const LoginModalWindow : FC<ModalWindowProps> = ({ isOpen, closeModal }) => {
    const [login] = authService.useLoginMutation();
    if (!isOpen) return null;

    const handleSubmit = (values: ILoginModel) => {

        console.log(values);
        const token = login(values);
        console.log(token)
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
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    title="Log in"
                    subtitle="Створіть новий акаунт"
                    submitLabel="Зареєструватися"
                >

                    <FormikInput<LoginTextValues>
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="example@gmail.com"
                    />
                    <FormikInput<LoginTextValues>
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                    />

                </UniversalForm>
            </div>
        </div>
    );
};

export default LoginModalWindow;