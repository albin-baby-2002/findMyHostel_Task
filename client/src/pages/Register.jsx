import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserRegister = gql`
  mutation reg($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      user {
        _id
        name
        role
        status
      }
    }
  }
`;

const Register = ({ auth, setAuth }) => {
  
  const [name, setName] = useState("");
  const [role, setrole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const [register, { data, loading, error }] = useMutation(UserRegister, {
    onError(err) {
      console.log(err.message, "register");
      toast.error(err.message);
    },
    onCompleted(data) {
      const user = data.register.user;
      console.log(user, "register");
      setAuth(user);
      navigate("/");
    },
  });

  // register handler

  const RegisterHandler = async () => {
    await register({
      variables: {
        registerInput: { name, password, confirmPassword, role },
      },
    });
  };

  return (
    <div className=" flex justify-center items-center min-h-screen font-Sen w-full">
      <div className=" flex flex-col gap-6 items-center w-2/6">
        <p className="  text-3xl font-semibold">Register Page</p>

        <div className="   gap-4 w-full">
          <label htmlFor="">name</label>

          <input
            className="border-2 w-full outline-none px-2 py-1 border-black"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        <div className=" flex flex-col w-full ">
          <label htmlFor="">Role</label>

          <input
            className="border-2 w-full outline-none px-2 py-1 border-black"
            type="text"
            value={role}
            placeholder="tenant or admin"
            onChange={(e) => {
              setrole(e.target.value);
            }}
          />
        </div>

        <div className=" flex flex-col w-full ">
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

        <div className=" flex flex-col w-full ">
          <label htmlFor="">confirmPassword</label>
          <input
            className="border-2 w-full outline-none px-2 py-1 border-black"
            type="text"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>

        <button
          disabled={loading}
          onClick={RegisterHandler}
          className=" bg-black text-white w-full py-2"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
