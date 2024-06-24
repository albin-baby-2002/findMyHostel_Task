import { gql, useMutation } from "@apollo/client";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VACATE_USER = gql`
  mutation vacate($vacateId: ID!) {
    vacate(id: $vacateId) {
      message
      bill {
        paidBills
        unpaidBills
        refundable
      }
    }
  }
`;

const SingleUserComponent = ({ user, refetch }) => {
  const [vacateUser, { data, loading, error }] = useMutation(VACATE_USER, {
    onError(err) {
      console.log(err, err.message);
      toast.error(err.message);
    },
    onCompleted(data) {
      console.log(data, "vacated user");
      refetch();
      toast.success("user vacated");
    },
  });

  const navigate = useNavigate();
  return (
    <div
      className=" border-b py-4 px-7  hover:bg-slate-300 border-black "
      onClick={() => {
        navigate(`/user/${user._id}`);
      }}
    >
      <div className=" grid   grid-cols-[repeat(4,1fr),50px]">
        <p>{user._id}</p>
        <p className=" text-center">{user.name}</p>
        <p className=" text-center">{user.role}</p>
        <p className=" text-center">{user.status}</p>
        <div>
          <button
          
            className={` text-center px-2  py-1 ${
              user.status === "vacated"
                ? ""
                : " hover:bg-gray-800 hover:text-white"
            }`}
            onClick={async (e) => {
              e.stopPropagation();
              await vacateUser({
                variables: {
                  vacateId: user._id,
                },
              });
            }}
            disabled={user.status === "vacated" || loading}
          >
            vacate
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleUserComponent;
