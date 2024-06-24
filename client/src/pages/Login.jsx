import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserLogin = gql`
  mutation login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      user {
        _id
        name
        role
        status
      }
    }
  }
`;

const Login = ({ auth, setAuth }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // useEffect to check user auth state

  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  });

  // login handler

  const [login, { data, loading, error }] = useMutation(UserLogin, {
    onError(err) {
      console.log(err.message, "login");
      toast.error(err.message);
    },
    onCompleted(data) {
      const user = data.login.user;
      console.log(user, "login");
      setAuth(user);
      navigate("/");
    },
  });

  // login handler

  const LoginHandler = async () => {
    await login({ variables: { loginInput: { name, password } } });
  };

  return (
    <div className=" w-full flex justify-center items-center min-h-screen font-Sen">
      <div className=" flex flex-col gap-6 items-center w-2/6">
        <p className="  text-3xl font-semibold">Login Page</p>

        <div className=" flex flex-col w-full ">
          <label htmlFor="">User Name</label>

          <input
            className="border-2 w-full outline-none px-2 py-1 border-black"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        <div className=" flex w-full flex-col ">
          <label htmlFor="">Password</label>
          <input
            className="border-2 w-full outline-none px-2 py-1 border-black"
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button
          disabled={loading}
          onClick={LoginHandler}
          className=" bg-black text-white w-full py-2"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
