import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import AuthPage from "./components/AuthPage";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
