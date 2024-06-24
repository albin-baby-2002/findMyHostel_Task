import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BillsComponent from "../Components/BillsComponent";
import AddBillModel from "../Components/AddBillModel";
import toast from "react-hot-toast";

const GET_USER = gql`
  query getUsers($userId: ID!) {
    user(id: $userId) {
      _id
      name
      role
      status
      bills {
        _id
        amount
        billType
        status
        dueDate
      }
    }
  }
`;

const SingleUserPage = ({ auth, setAuth }) => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(GET_USER, {
    variables: { userId: id },
    onError(err) {
      toast.error(err.message)
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
      <div>
        <p>You don't have admin privileges to see and edit users</p>
      </div>
    );
  }

  return (
    <>
      {data && (
        <div>
          <div className=" flex  gap-6 px-10 py-6  justify-center text-white bg-gray-500 font-semibold font-Sen ">
            <div className=" flex gap-4">
              <p className="capitalize">User Name: {data.user.name}</p>
              <p>Status: {data.user.status}</p>
              <p>Role: {data.user.role}</p>
            </div>

            <button
              onClick={() => {
                setShowModal(true);
              }}
              className=" bg-black px-2 py-1 rounded-md"
            >
              Add New Bill
            </button>
          </div>
          <div className=" text-center py-4">
            {data.user.bills.length <= 0 && <p>User doesn't have any bills</p>}
            {data.user.bills.length > 0 && (
              <>
                <p className=" font-Sen  my-10 text-2xl font-bold">
                  User Bill Details
                </p>
                <BillsComponent bills={data.user.bills} refetch={refetch} />
              </>
            )}
          </div>
          <AddBillModel
            refetch={refetch}
            user={data.user}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </div>
      )}
    </>
  );
};

export default SingleUserPage;
