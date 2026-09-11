import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/home/home";
import Header from "./pages/components/layouts/header/header";
import Footer from "./pages/components/layouts/footer/footer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        { /* <Route path="/login" element={<Login />} /> */}
      </Routes>
      <Footer />
    </Router>
  </StrictMode>,
);