import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SingleUserComponent from "../Components/SingleUserComponent";
import toast from "react-hot-toast";

const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      name
      role
      status
    }
  }
`;

const Users = ({ auth, setAuth }) => {
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    onError(err) {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }

    refetch();
  }, [auth]);

  if (!auth || auth.role !== "admin") {
    return (
      <div className=" flex items-center h-[calc(100vh-64px)] justify-center">
        <p>You don't have admin privileges to see and edit users</p>
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto py-12 font-Sen">
      {data?.users && (
        <p className=" py-10 text-center text-3xl font-bold ">
          Users Data Table
        </p>
      )}

      <div className="  grid   text-sm bg-slate-200  rounded-md">
        {data?.users && (
          <>
            <div className=" grid py-5 font-semibold px-7 grid-cols-[repeat(4,1fr),50px] border-b  border-black">
              <p className=" text-center">User ID</p>
              <p className=" text-center">User Name</p>

              <p className=" text-center">Role</p>
              <p className=" text-center">Status</p>
              <p className=" text-right">Actions</p>
            </div>
            {data.users?.map((user, idx) => (
              <SingleUserComponent key={idx} user={user} refetch={refetch} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
