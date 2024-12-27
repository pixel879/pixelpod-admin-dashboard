import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Toaster, toast } from "react-hot-toast";

function Authentication() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [captcha, setCaptcha] = useState([]);
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const newCaptcha = [];
    for (let i = 0; i < 6; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const rotation = (Math.random() - 0.5) * 30; // Random rotation between -15 and 15 degrees
      newCaptcha.push({ char, rotation });
    }
    setCaptcha(newCaptcha);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enteredCaptcha !== captcha.map((c) => c.char).join("")) {
      toast.error("CAPTCHA does not match. Please try again.");
      generateCaptcha();
      return;
    }

    const data = { userId, role, password, rememberMe };

    try {
      const response = await fetch(`${BASE_URL}/admin/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to log in");
      }

      const result = await response.json();

      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("token", result.token);

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error:", error.message);
      if (error.message === "Failed to log in") {
        toast.error("Invalid UserId or Password!");
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      {/* <div className="hidden lg:block w-2/3 h-screen relative">
        <img src="/" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white"></div>
        <div className="relative z-10 text-white text-center p-8">
          <h1 className="text-4xl font-bold">our</h1>
          <div className="text-2xl pt-2">Customized Product</div>
          <div className="text-2xl font-bold pt-2 text-orange-400">In One Place...</div>
        </div>
      </div> */}
      <div className="md:w-[480px]  p-8  rounded-md bg-black text-white">
        <div className="text-center mb-4">
          <img src="./logo.png" alt="Software Logo" className=" h-12 mx-auto" />
        </div>

        <h4 className="text-center text-lg">Sign In</h4>
        <form onSubmit={handleSubmit} className="pt-3" autoComplete="off">
          <div className="mb-4">
            <label htmlFor="userId" className="block mb-2 font-semibold">
              User Id
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block mb-2 font-semibold">
              Role
            </label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 text-black"
            />
            <label htmlFor="rememberMe" className="text-gray-300">
              Remember me
            </label>
          </div>
          <div className="mb-4">
            <div className="relative flex items-center">
              <input
                type="text"
                id="enteredCaptcha"
                value={enteredCaptcha}
                onChange={(e) => setEnteredCaptcha(e.target.value)}
                className="w-full px-3 py-2 border rounded text-black"
                required
                placeholder="Enter CAPTCHA"
              />
              <div className="absolute right-20 mb-2 p-1 mt-2 bg-gray-200 font-mono font-bold tracking-wide text-xl text-black select-none">
                {captcha.map((c, index) => (
                  <span
                    key={index}
                    style={{
                      transform: `rotate(${c.rotation}deg)`,
                      display: "inline-block",
                    }}
                  >
                    {c.char}
                  </span>
                ))}
              </div>
              <i
                className="fa-solid fa-sync-alt absolute right-2  cursor-pointer text-indigo-500"
                onClick={generateCaptcha}
              ></i>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-red-600 font-bold text-white tracking-widest "
          >
            Sign In
          </button>
        </form>

        <Toaster
          toastOptions={{
            error: {
              iconTheme: {
                primary: "rgb(30 27 75);",
              },
            },
            success: {
              iconTheme: {
                primary: "rgb(30 27 75);",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Authentication;
