"use client";

import { useState, Suspense } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

const SignInContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Global loader
  const [buttonLoading, setButtonLoading] = useState(false); // Button loader
  const [error, setError] = useState(""); // Error message state

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const safeRedirect =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/admin";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true); // Show button loader
    setLoading(true); // Show page loader
    setError(""); // Reset any previous error message

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            role: "admin",
          }),
          credentials: "include",
        }
      );

      const data = await res.json();

      console.log(data);
      

      if (data.success) {
        toast.success("Welcome!");
        localStorage.setItem("user_session", "true");
        localStorage.setItem("user_gender", data.user.gender || "");
        localStorage.setItem("user_name", data.user.name || "");
        router.push(safeRedirect);
      } else if (data.otpPending) {
        router.push(
          `/verify-otp?email=${encodeURIComponent(data.user.email)}&type=${encodeURIComponent(
            data.user.role
          )}&redirect=${encodeURIComponent(safeRedirect)}`
        );
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide page loader
      setButtonLoading(false); // Hide button loader
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="animate-spin rounded-full border-t-4 border-blue-600 w-16 h-16"></div>
        </div>
      )}
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              id="email"
              className="w-full p-3 text-gray-900 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              className="w-full p-3 text-gray-900 placeholder-gray-400 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error message section */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-900">
              <input type="checkbox" className="mr-2" />
              Keep me logged in
            </label>
            <a href="#" className="text-sm text-indigo-500">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={buttonLoading}
            className="w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {buttonLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full border-t-4 border-white w-6 h-6 mr-2"></div>
                <span>Loading...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="animate-spin rounded-full border-t-4 border-blue-600 w-16 h-16"></div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
