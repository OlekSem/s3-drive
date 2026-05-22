import * as Yup from "yup";
import type { FC } from "react";
import UniversalForm from "./UniversalForm";
import FormikInput from "./FormikInput";
import FormikFileInput from "./FormikFileInput";
// import {authService} from "../service/AuthService.ts";
import type IRegisterModel from "../models/IRegisterModel.ts";

// interface RegisterValues {
//     username: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
//     avatar: File | null;
// }
type RegisterTextValues = Omit<IRegisterModel, "avatar">;
const initialValues: IRegisterModel = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
};

const validationSchema = Yup.object({
    username: Yup.string().required("Username обов'язковий"),
    email: Yup.string().email("Введіть коректний email").required("Email обов'язковий"),
    password: Yup.string().min(6, "Мінімум 6 символів").required("Пароль обов'язковий"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Паролі не співпадають")
        .required("Підтвердіть пароль"),
    avatar: Yup.mixed().nullable(),
});

interface ModalWindowProps {
    isOpen: boolean;
    closeModal: () => void;
}

const RegisterModalWindow: FC<ModalWindowProps> = ({ isOpen, closeModal }) => {
    // const [register] = authService.useRegisterMutation();
    if (!isOpen) return null;
    const handleSubmit = (values: IRegisterModel) => {
        console.log(values)
        // const token = register(values)
        // console.log(token);
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
                    title="Реєстрація"
                    subtitle="Створіть новий акаунт"
                    submitLabel="Зареєструватися"
                >
                    <FormikInput<RegisterTextValues>
                        name="username"
                        label="Username"
                        placeholder="Введіть username"
                    />
                    <FormikInput<RegisterTextValues>
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="example@gmail.com"
                    />
                    <FormikInput<RegisterTextValues>
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                    />
                    <FormikInput<RegisterTextValues>
                        name="confirmPassword"
                        label="Confirm password"
                        type="password"
                        placeholder="••••••••"
                    />
                    <FormikFileInput<IRegisterModel>
                        name="avatar"
                        label="Avatar"
                    />
                </UniversalForm>
            </div>
        </div>
    );
};

export default RegisterModalWindow;