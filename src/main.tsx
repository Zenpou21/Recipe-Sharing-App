import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { HeroUIProvider } from "@heroui/react";
import { Providers } from "./Providers.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <Providers>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Providers>
    </HeroUIProvider>
  </StrictMode>,
);
