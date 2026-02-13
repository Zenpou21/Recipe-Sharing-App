import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./routes";

function App() {
  return (
    <>
      <Routes>
        {routes().map((route, index) => {
          const { path, component: Component } = route;

          return (
            <Route
              key={index}
              path={path}
              element={
                <Suspense>
                  <Component />
                </Suspense>
              }
            />
          );
        })}
      </Routes>
    </>
  );
}

export default App;
