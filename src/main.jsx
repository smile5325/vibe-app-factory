import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VibeAppFactory from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <VibeAppFactory />
  </StrictMode>
);
