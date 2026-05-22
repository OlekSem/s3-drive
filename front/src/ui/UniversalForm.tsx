import { useFormik, FormikProvider, Form, type FormikValues } from "formik";
import * as Yup from "yup";
import type { ReactElement, ReactNode } from "react";

interface UniversalFormProps<T extends FormikValues> {
    initialValues: T;
    validationSchema: Yup.AnyObjectSchema;
    onSubmit: (values: T) => void;
    children: ReactNode;
    title?: string;
    subtitle?: string;
    submitLabel?: string;
}

const UniversalForm = <T extends FormikValues>({
                                                   initialValues,
                                                   validationSchema,
                                                   onSubmit,
                                                   children,
                                                   title,
                                                   subtitle,
                                                   submitLabel = "Підтвердити",
                                               }: UniversalFormProps<T>): ReactElement => {
    const formik = useFormik<T>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <FormikProvider value={formik}>
            {title && (
                <div className="mb-6">
                    <h1 className="text-[22px] font-medium text-[var(--logo-text)]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[13px] text-[#888780] mt-1">{subtitle}</p>
                    )}
                </div>
            )}

            <Form className="flex flex-col gap-[14px]">
                {children}

                <button
                    type="submit"
                    className="
            w-full mt-2
            rounded-[10px]
            bg-[var(--button-bg)]
            py-3
            text-sm font-medium
            text-[var(--button-text)]
            hover:opacity-85
            active:scale-[0.99]
            transition-all
          "
                >
                    {submitLabel}
                </button>
            </Form>
        </FormikProvider>
    );
};

export default UniversalForm;