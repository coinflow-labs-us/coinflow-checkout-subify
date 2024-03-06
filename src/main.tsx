import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BuyCredits } from "./pages/BuyCredits.tsx";
import { Subscribe } from "./pages/Subscribe.tsx";
import { UsdcPurchase } from "./pages/UsdcPurchase.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <></>, // Error Page
    children: [
      {
        path: "/buy-credits",
        element: <BuyCredits />,
      },
      {
        path: "/subscribe",
        element: <Subscribe />,
      },
      {
        path: "/usd-purchase",
        element: <UsdcPurchase />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
