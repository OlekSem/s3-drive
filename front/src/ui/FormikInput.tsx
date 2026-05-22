import { useFormikContext } from "formik";

interface FormikInputProps<T> {
    name: keyof T;
    label: string;
    type?: string;
    placeholder?: string;
}

function FormikInput<T extends Record<string, string | number>>({
                                                                    name,
                                                                    label,
                                                                    type = "text",
                                                                    placeholder,
                                                                }: FormikInputProps<T>) {
    const { values, errors, touched, handleChange, handleBlur } =
        useFormikContext<T>();

    return (
        <div className="flex flex-col">
            <label className="text-[13px] text-[#5F5E5A] mb-[6px]">{label}</label>
            <input
                name={name as string}
                type={type}
                value={values[name] as string | number}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="
          bg-[var(--search)]
          border border-[var(--border)]
          rounded-[10px]
          px-4 py-[10px]
          text-sm text-[var(--placeholder)]
          placeholder:text-[#B4B2A9]
          outline-none
          transition-colors
          focus:border-[#888780]
          w-full
        "
            />
            {touched[name] && errors[name] && (
                <span className="text-[#A32D2D] text-[12px] mt-[5px]">
          {errors[name] as string}
        </span>
            )}
        </div>
    );
}

export default FormikInput;