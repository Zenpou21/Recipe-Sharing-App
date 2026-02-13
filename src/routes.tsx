import { lazy } from "react";

const Recipes = lazy(() => import("./pages/Recipes/Recipes"));

const routes = () => [
  {
    path: "/",
    component: Recipes,
  },
];

export default routes;
