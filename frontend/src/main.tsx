import { createRoot } from "react-dom/client";
import App from "./app/App";
import { AuthProvider } from "./app/AuthContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
