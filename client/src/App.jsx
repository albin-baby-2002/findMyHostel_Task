import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import { useEffect, useState } from "react";
import useCheckLoginState from "./Hooks/useCheckLoginState";
import AuthChecker from "./HOC/AuthChecker";
import SingleUserPage from "./pages/SingleUserPage";

function App() {
  const [auth, setAuth] = useState(null);

  const { checkUserLogin } = useCheckLoginState();
  
  
// when refreshed or loading first time check user loggedIn or not
  useEffect(() => {
    async function loginCheck() {
      const user = await checkUserLogin();
      setAuth(user);
    }
    loginCheck();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<AuthChecker auth={auth} setAuth={setAuth} />}>
          <Route index element={<Users auth={auth} setAuth={setAuth} />} />
          <Route
            path="/login"
            element={<Login auth={auth} setAuth={setAuth} />}
          />
          <Route
            path="/register"
            element={<Register auth={auth} setAuth={setAuth} />}
          />

          <Route
            path="/user/:id"
            element={<SingleUserPage auth={auth} setAuth={setAuth} />}
          />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
