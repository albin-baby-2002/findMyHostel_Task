import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import useCheckLoginState from "../Hooks/useCheckLoginState";
import PageLoader from "../Components/PageLoader";
import useLogout from "../Hooks/useLogout";
import { Toaster } from "react-hot-toast";

const AuthChecker = ({ auth, setAuth }) => {
  // hook to check user loggedIn and set AuthState
  const { checkUserLogin } = useCheckLoginState();

  // loading state
  const [loading, setLoading] = useState(false);

  // logout hook
  const logout = useLogout();

  // function to handle successfull logout
  const handleLogout = async () => {
    const result = await logout();

    if (result) {
      setAuth(null);
    } else {
      alert("failed to logout");
    }
  };

  // useEffect to  check change in auth state
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const user = await checkUserLogin();

      if (user) {
        setAuth(user);
      }

      setLoading(false);
    };

    !auth ? checkAuth() : setLoading(false);
  }, [auth]);

  return (
    <>
      {loading && <PageLoader />}

      {!loading && (
        <div>
          <div className=" bg-slate-700 text-white flex py-4 px-8 gap-4 font-Sen">
            <div className=" flex justify-between w-full">
              <p className=" font-bold bg-black px-2 py-1">Findmyhotel</p>

              <div className=" flex items-center gap-4">
                <Link to={"/register"}>Register</Link>
                <Link to={"/"}>Users</Link>

                {auth && (
                  <div className=" flex items-center ">
                    <div className="font-bold bg-black px-2 py-1 cursor-pointer">
                      {/* <p>{auth.name}</p> */}
                      <p onClick={handleLogout}>Logout</p>
                    </div>
                  </div>
                )}

                {!auth && (
                  <div>
                    <Link to={"/login"}>Login</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Toaster position="bottom-right" />

          <Outlet />
        </div>
      )}
    </>
  );
};

export default AuthChecker;
