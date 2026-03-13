// 




import axios from 'axios';
import React, { useContext, useRef } from 'react';
import { FaKey } from "react-icons/fa";
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Settings() {

    const currentPassword = useRef(null);
    const newPassword = useRef(null);
    const confirmPassword = useRef(null);
    const navigate = useNavigate();

    const { setlogedUserId, setuserLogin } = useContext(AuthContext);

    // فانكشن تجهيز البيانات وإرسال request
    function changePassword() {

        // ✅ تحقق من مطابقة الباسورد الجديد و confirm
        if (newPassword.current.value !== confirmPassword.current.value) {
            alert("New password and confirm password do not match");
            return;
        }

        // ✅ اطبع التوكن والبيانات قبل request
        // console.log("Token before request:", localStorage.getItem("userToken"));
        // console.log("Current password:", currentPassword.current.value);
        // console.log("New password:", newPassword.current.value);

        return axios.patch(
            "https://route-posts.routemisr.com/users/change-password",
            {
                password: currentPassword.current.value,
                newPassword: newPassword.current.value
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    "Content-Type": "application/json"
                }
            }
        );
    }

    // ✅ استخدام React Query للميوتشن
    const { mutate } = useMutation({
        mutationFn: changePassword,
        onSuccess: (res) => {
            const { message, data } = res.data;

            if (message === "password changed successfully") {
                localStorage.removeItem("userToken");
                setuserLogin(null);     // ✅ مهم
                // setlogedUserId(null);   // ✅ مهم
                navigate("/login");
            }
        },
        onError: (err) => {
            console.error("Error changing password:", err.response?.data || err.message);
            alert("Failed to change password. Please check current password and try again.");
        }
    });

    return (
        <div className="max-w-150 mx-auto mb-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 ">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaKey className="text-blue-500 text-xl"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Change Password</h2>
                        <p className="text-gray-500 text-sm">
                            Keep your account secure by using a strong password.
                        </p>
                    </div>
                </div>

                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        mutate();
                    }}
                    className="flex flex-col gap-5"
                >
                    <div>
                        <label className="font-medium">Current password</label>
                        <input
                            ref={currentPassword}
                            type="password"
                            placeholder="Enter current password"
                            className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="font-medium">New password</label>
                        <input
                            ref={newPassword}
                            type="password"
                            placeholder="Enter new password"
                            className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            At least 8 characters with uppercase, lowercase, number, and special character.
                        </p>
                    </div>

                    <div>
                        <label className="font-medium">Confirm new password</label>
                        <input
                            ref={confirmPassword}
                            type="password"
                            placeholder="Re-enter new password"
                            className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Update password
                    </button>
                </form>
            </div>
        </div>
    );
}