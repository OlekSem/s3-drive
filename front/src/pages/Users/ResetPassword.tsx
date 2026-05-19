
import {Link} from "react-router";
import {ChevronLeftIcon, EyeCloseIcon, EyeIcon} from "../../admin/icons";
import Label from "../../admin/components/form/Label.tsx";
import Input from "../../admin/components/form/input/InputField.tsx";
import React from "react";
import Button from "../../admin/components/ui/button/Button.tsx";
import axios from "axios";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import ENV from "../../env/index";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const token = params.get("token");
    const email = params.get("email");

    if (!token || !email) {
        return <p>Invalid or expired reset link</p>;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(confirm!=password){
            alert("Passwords do not match");
            return;
        }

        await axios.post(ENV.API_BASE_URL+"/api/Entity/ResetPassword",
            {
                email: email,
                token: token,
                newPassword: password,
                confirmNewPassword: confirm,
            }).then(res => {
                console.log(res);
                alert("Password reset successfully");
        }).catch( ()=>{
                alert("Something went wrong");
        })
        navigate('/signin');
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="w-full max-w-md pt-10 mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="size-5" />
                    Back to dashboard
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your new password and confirm it!
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>


                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter a new password"
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                          {showPassword ? (
                                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                          ) : (
                                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                          )}
                                        </span>
                                    </div>
                                </div>


                                <div>
                                    <Label>
                                        Confirm password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={confirm}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setConfirm(e.target.value)
                                            }
                                        />
                                        <span
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                          {showConfirm ? (
                                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                          ) : (
                                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                          )}
                                        </span>
                                    </div>
                                </div>







                                <div className="flex items-center justify-between">
                                </div>
                                <div>
                                    <Button className="w-full" size="sm">
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}