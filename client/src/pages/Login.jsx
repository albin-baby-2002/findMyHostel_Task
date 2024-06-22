import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const UserLogin = gql`
  mutation login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      user {
        _id
        name
        email
        role
        token
        status
      }
    }
  }
`;

const Login = () => {
  const [login, { data, loading, error }] = useMutation(UserLogin, {
    onError(err) {
      console.log(err);
    },
    onCompleted(data){
        navigate('/register')
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate()

 

  return (
    <div className=" flex justify-center items-center min-h-screen">
      <div className=" flex flex-col gap-6 items-center">
        <p className="  text-3xl font-semibold">Login Page</p>

        {error && <div>{error.message}</div>}

        <div className=" flex flex-col ">
          <label htmlFor="">email</label>

          <input
            className="border-2 outline-none px-2 py-1 border-black"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className=" flex flex-col ">
          <label htmlFor="">Password</label>
          <input
            className="border-2 outline-none px-2 py-1 border-black"
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button
          onClick={async () => {
            
            await login({ variables: { loginInput: { email, password } } });
            
            
            
            
          }}
          className=" bg-black text-white w-full py-1"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
