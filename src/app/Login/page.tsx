"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://liyt-api-1.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth: formData }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;

        if (token && user) {
          // Store token and user ID in localStorage
          localStorage.setItem("authToken", token);
          localStorage.setItem("userId", user.id);
          router.push("/Landing");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      setError(`${error}An error occurred. Please try again.`);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex max-w-4xl w-full">
          {/* Left Side */}
          <div className="w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-10 text-white flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">LIYT</h1>
              <h2 className="text-2xl font-semibold mb-4">
                Revolutionize Your Delivery System
              </h2>
              <p className="text-lg">Revolutionize Your Delivery System</p>
            </div>
            <div className="mt-10">
              <p className="text-lg">Do not have an account?</p>
              <a
                href="/signup"
                className="text-white underline mt-2 inline-block hover:text-gray-200"
              >
                Sign up here
              </a>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-1/2 p-10 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-6">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form className="space-y-4 w-full" onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md font-semibold"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
