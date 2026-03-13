import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaSnapchat } from "react-icons/fa";


export default function LandingPage() {
return (
<div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex flex-col items-center justify-center text-white px-4">
    
    {/* Logo / Brand */}
    <div className="mb-10 text-center">
    <h1 className="text-5xl font-extrabold mb-2">SOCIAL-APP</h1>
    <p className="text-lg opacity-90">Connect with your friends around the world</p>
    </div>

    {/* Social Icons */}
    <div className="flex gap-6 mb-10 text-2xl">
    <FaFacebook className="hover:text-blue-600 transition-colors cursor-pointer" />
    <FaTwitter className="hover:text-blue-400 transition-colors cursor-pointer" />
    <FaInstagram className="hover:text-pink-400 transition-colors cursor-pointer" />
    <FaLinkedin className="hover:text-blue-700 transition-colors cursor-pointer" />
    <FaSnapchat className="hover:text-yellow-400 transition-colors cursor-pointer" />
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4">
    <Link
        to="/login"
        className="px-8 py-3 rounded-lg bg-white text-purple-600 font-semibold text-lg hover:bg-purple-100 transition"
    >
        Login
    </Link>
    <Link
        to="/register"
        className="px-8 py-3 rounded-lg border-2 border-white font-semibold text-lg hover:bg-white hover:text-purple-600 transition"
    >
        Register
    </Link>
    </div>

    {/* Footer Text */}
    <p className="mt-16 opacity-80 text-sm text-center max-w-md">
    © 2026 SOCIAL-APP. All rights reserved. Connect, share, and stay in touch with your friends.
    </p>
</div>
);
}
