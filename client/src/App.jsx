import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" >
          <Route index element={<Login />} />

          <Route path="/register" element={<Register/>} />
          <Route path="/users" element={<Users/>} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
