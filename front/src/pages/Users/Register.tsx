import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Label from "../../Extra/form/Label.tsx";
import Input from "../../Extra/form/input/InputField.tsx";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../Extra/icons";
import axios from "axios";
import ENV from "../../env";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const[showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPhoto(file ?? null);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);

        if (photo) formData.append("image", photo);

        try {
            const res = await axios.post(
                ENV.API_BASE_URL + "/api/auth/register",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if(res.status === 201 || res.status === 200) {
                navigate("/login");
                alert("Registration successful!");
            }

            else{
                alert("Something went wrong!");
                navigate("/");
            }

            // localStorage.setItem("token", res.data.token);
            // appDispatch(loginSuccess(res.data.token));

        } catch (err) {
            console.error("Error:", err);
            alert("Registration failed");
        }

    };


    // function handleGoogleLoginResponse(response:CredentialResponse) {
    //     const idToken = response.credential;
    //
    //     axios.post(
    //         APP_ENV.API_BASE_URL + "/api/Entity/GoogleLogin", {
    //             idToken: idToken
    //         })
    //         .then(res => {
    //             console.log("Server token:", res.data.token);
    //             localStorage.setItem("token", res.data.token);
    //         })
    //         .catch(err => {
    //             console.error("Login failed", err);
    //         });
    // }


    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-2/3 no-scrollbar mx-auto">
            <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
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
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md ">
                            Sign Up
                        </h1>
                        <p className="text-sm text-gray-500 ">
                            Enter your email and password to sign up!
                        </p>
                        <p className={"text-gray-500 "}><b>OR</b></p>
                    </div>




                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <Label>
                                        User name<span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        name="fname"
                                        placeholder="Enter your first name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                            </div>

                            <div>
                                <Label>
                                    Email<span className="text-error-500">*</span>
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>
                                    Password<span className="text-error-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500  size-5" />
                                        )}
                                  </span>
                                </div>
                            </div>

                            <div>
                                <Label>
                                    Confirm Password<span className="text-error-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Confirm your password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <span
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500  size-5" />
                                        )}
                                  </span>
                                </div>
                            </div>


                            <div>
                                <Label>Photo</Label>
                                <input
                                    className="mt-1 w-full rounded-2xl border border-gray-300 bg-white p-4 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600 dark:placeholder-gray-400"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />


                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-3 h-24 w-24 rounded-lg object-cover border "
                                    />
                                )}
                            </div>

                            <div>
                                <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs  dark:bg-blue-600 hover:bg-blue-700">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-5">
                        <p className="text-sm font-normal text-center text-gray-700  sm:text-start">
                            Have an account? {""}
                            <Link
                                to="/signin"
                                className="text-brand-500 hover:text-brand-600 "
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
