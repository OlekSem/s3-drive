import { useState } from "react";
import { useFormikContext } from "formik";

interface FormikFileInputProps<T> {
    name: keyof T;
    label: string;
}

function FormikFileInput<T>({ name, label }: FormikFileInputProps<T>) {
    const { setFieldValue, errors, touched } = useFormikContext<T>();
    const [preview, setPreview] = useState<string | null>(null);

    return (
        <div className="flex flex-col">
            <label className="text-[13px] text-[#5F5E5A] mb-[6px]">{label}</label>
            <label className="
        mt-[2px]
        flex flex-col items-center justify-center gap-2
        rounded-xl
        border border-dashed border-[var(--border)]
        p-5
        cursor-pointer
        hover:border-[#888780]
        hover:bg-[var(--hover-bg)]
        transition-colors
      ">
                {preview ? (
                    <img
                        src={preview}
                        alt="preview"
                        className="w-20 h-20 rounded-full object-cover border border-[var(--border)]"
                    />
                ) : (
                    <>
                        <div className="
              w-11 h-11 rounded-full
              bg-[var(--hover-bg)]
              flex items-center justify-center
              text-[#5F5E5A] text-xl
            ">
                            ↑
                        </div>
                        <span className="text-[13px] text-[#888780]">Завантажити фото</span>
                    </>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) {
                            setFieldValue(name as string, file);
                            setPreview(URL.createObjectURL(file));
                        }
                    }}
                />
            </label>
            {touched[name] && errors[name] && (
                <span className="text-[#A32D2D] text-[12px] mt-[5px]">
          {errors[name] as string}
        </span>
            )}
        </div>
    );
}

export default FormikFileInput;