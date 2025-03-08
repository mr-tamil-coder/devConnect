import React, { useState, useEffect } from "react";
import {
  Github,
  Mail,
  Lock,
  User,
  Terminal,
  Code,
  Braces,
  Coffee,
  Bug,
  Database,
} from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { API } from "../data/main";
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    emailId: "mohan1@gmail.com",
    password: "",
    name: "",
    github: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const [loadingState, setLoadingState] = useState("");

  const [animationText, setAnimationText] = useState("");
  const [error,setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const codeSnippets = [
    "function findLove() { return developer.match(); }",
    "try { heart.open() } catch (feelings) { }",
    'import { love } from "heart";',
    'git commit -m "Looking for pair programming partner"',
    "while(single) { searchDev(coffee.drink()); }",
    "// Breaking production and hearts since 2024",
  ];

  // Matrix rain effect characters
  const chars = "ABCDEF0123456789</>{}[];:";
  const [matrixChars, setMatrixChars] = useState([]);

  useEffect(() => {
    // Create matrix rain characters
    const newMatrixChars = Array(50)
      .fill(null)
      .map(() => ({
        char: chars[Math.floor(Math.random() * chars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.5 + Math.random() * 2,
        opacity: Math.random(),
      }));
    setMatrixChars(newMatrixChars);

    const interval = setInterval(() => {
      setMatrixChars((prev) =>
        prev.map((char) => ({
          ...char,
          y: (char.y + char.speed) % 100,
          char:
            Math.random() < 0.1
              ? chars[Math.floor(Math.random() * chars.length)]
              : char.char,
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    let snippetIndex = 0;

    const typeText = () => {
      if (currentIndex < codeSnippets[snippetIndex].length) {
        currentText += codeSnippets[snippetIndex][currentIndex];
        setAnimationText(currentText);
        currentIndex++;
        setTimeout(typeText, 50);
      } else {
        setTimeout(() => {
          currentText = "";
          currentIndex = 0;
          snippetIndex = (snippetIndex + 1) % codeSnippets.length;
          setAnimationText("");
          typeText();
        }, 2000);
      }
    };

    typeText();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API+"/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(response.data));
      return navigate('/')
    } catch (err) {
      console.log(err.response.data);
      
      setError(err.response.data);
      setLoadingState("failed");
    }
    setLoadingState("loading");
    // Simulate loading with progress messages
    await new Promise((r) => setTimeout(r, 1000));
    setLoadingState("validating");
    await new Promise((r) => setTimeout(r, 800));
    setLoadingState("success");
    await new Promise((r) => setTimeout(r, 1000));
    setLoadingState("");
  };

  const getLoadingMessage = () => {
    switch (loadingState) {
      case "loading":
        return "Compiling credentials...";
      case "validating":
        return "Running security tests...";
      case "success":
        return "Build successful!";
      case "failed":
        return "Build failed!";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix rain effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {matrixChars.map((item, i) => (
          <div
            key={i}
            className="absolute text-green-500 font-mono text-opacity-50 transform transition-all duration-1000"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              opacity: item.opacity,
            }}
          >
            {item.char}
          </div>
        ))}
      </div>

      {/* Floating IDE elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          "function",
          "const",
          "let",
          "import",
          "export",
          "class",
          "return",
        ].map((word, i) => (
          <div
            key={word}
            className="absolute text-purple-400 opacity-20 font-mono text-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${-Math.random() * 5}s`,
            }}
          >
            {word}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative">
        {/* IDE-like header */}
        <div className="bg-gray-800 rounded-t-lg p-2">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"></div>
              <div className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Bug className="h-4 w-4 text-gray-500" />
              <Coffee className="h-4 w-4 text-gray-500" />
              <Terminal className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-95 backdrop-blur-lg rounded-b-lg shadow-2xl border border-gray-700 relative">
          {/* Tab bar */}
          <div className="flex border-b border-gray-700">
            <div className="px-4 py-2 bg-gray-900 text-green-400 font-mono text-sm border-r border-gray-700 flex items-center">
              <Code className="h-4 w-4 mr-2" />
              auth.tsx
            </div>
            <div className="px-4 py-2 text-gray-500 font-mono text-sm border-r border-gray-700 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              schema.sql
            </div>
          </div>

          {/* Line numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 bg-opacity-50 flex flex-col items-center py-6 text-gray-600 font-mono text-xs">
            {Array(20)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="my-1">
                  {i + 1}
                </div>
              ))}
          </div>

          <div className="p-6 pl-16">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4 space-x-3">
                <Code className="h-8 w-8 text-green-400 animate-pulse" />
                <h1 className="text-3xl font-bold text-white font-mono">
                  DevTinder
                </h1>
                <span className="text-gray-500 text-sm">v2.0.24</span>
              </div>
              <div className="h-6 text-green-400 font-mono text-sm overflow-hidden">
                <span className="opacity-50">~/user/auth $ </span>
                {animationText}
                <span className="animate-blink">█</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-1 group">
                    <label className="block text-sm font-mono text-green-400 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all group-hover:border-green-500/50"
                    />
                  </div>

                  <div className="space-y-1 group">
                    <label className="block text-sm font-mono text-green-400 flex items-center">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub Username
                    </label>
                    <input
                      name="github"
                      type="text"
                      placeholder="johndoe"
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all group-hover:border-green-500/50"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1 group">
                <label className="block text-sm font-mono text-green-400 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </label>
                <input
                  name="emailId"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all group-hover:border-green-500/50"
                />
              </div>

              <div className="space-y-1 group">
                <label className="block text-sm font-mono text-green-400 flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all group-hover:border-green-500/50"
                />
              </div>
              <p className="text-sm text-red-500">{error} </p>
              <button
                type="submit"
                disabled={loadingState !== ""}
                className="w-full bg-green-500 text-gray-900 py-2 px-4 rounded-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all font-mono font-bold relative overflow-hidden group disabled:opacity-50"
              >
                <span
                  className={`transition-opacity ${
                    loadingState ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {isLogin ? "> Sign In" : "> Create Account"}
                </span>
                {loadingState && (
                  <span className="absolute inset-0 flex items-center justify-center text-gray-900 font-mono text-sm">
                    {getLoadingMessage()}
                  </span>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400 font-mono">
                    /* OAuth Integration */
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full border border-gray-700 bg-gray-900 text-gray-300 py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all flex items-center justify-center group"
              >
                <Github className="mr-2 h-5 w-5 group-hover:text-green-400" />
                <span className="font-mono">auth.loginWithGithub()</span>
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-green-400 hover:text-green-300 font-mono inline-flex items-center"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  {isLogin
                    ? "$ register --new-user"
                    : "$ login --existing-user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Styling for animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
