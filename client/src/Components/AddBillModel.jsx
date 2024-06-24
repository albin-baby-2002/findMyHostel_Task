import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const ADD_NEW_BILL = gql`
  mutation NEWbILL($newBillInput: NewBillInput!) {
    newBill(newBillInput: $newBillInput) {
      message
    }
  }
`;

const AddBillModel = ({
  user,
  wider = false,
  showModal = true,
  setShowModal,
  refetch,
}) => {
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [billType, setBillType] = useState("");

  const [addBill, { data, loading, error }] = useMutation(ADD_NEW_BILL, {
    onError(err) {
      console.log(err);
      toast.error(err.message);
    },
    onCompleted(data) {
      console.log(data, "add new bill");
      refetch();
      setShowModal(false);
      toast.success("new bill created");
    },
  });

  if (!showModal) {
    return null;
  }

  return (
    <div
      className=" 
            fixed inset-0 z-30 flex items-center justify-center bg-black/25 font-Sen  "
    >
      <div
        className={`${
          wider ? " md:w-2/3 lg:w-3/4" : " sm:w-3/4 md:w-2/3 lg:w-2/5  xl:w-2/5"
        } mx-auto  my-6 h-full w-full  sm:h-auto  `}
      >
        <div
          className={` 
        translate h-full duration-300 sm:h-auto
        ${showModal ? "translate-y-0" : "translate-y-full"}
        ${showModal ? "opacity-100" : "opacity-0"}  `}
        >
          <div
            className="
                translate relative flex h-full w-full flex-col rounded-lg border-0 bg-white  pb-4 shadow-lg sm:h-auto sm:max-h-[95vh]  
            "
          >
            <div className=" flex items-center justify-center rounded-t border-b-[1px] px-4 py-4  ">
              <button
                className="absolute left-9 "
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <IoMdClose size={25} />
              </button>

              <p className=" text-md font-bold">Add New Bill</p>
            </div>

            <div className="max-h-[95vh]  overflow-y-auto">
              <div className=" px-4 py-4 sm:px-8  grid  gap-3">
                <div className=" flex flex-col ">
                  <label className="py-1" htmlFor="">
                    userId
                  </label>
                  <input
                    className="border-2 outline-none px-2 py-1 border-black"
                    type="text"
                    value={user._id}
                    disabled
                  />
                </div>

                <div className=" flex flex-col ">
                  <label className="py-1" htmlFor="">
                    Bill Type
                  </label>
                  <input
                    className="border-2 outline-none px-2 py-1 border-black"
                    type="text"
                    placeholder="security or other"
                    value={billType}
                    onChange={(e) => {
                      setBillType(e.target.value);
                    }}
                  />
                </div>

                <div className=" flex flex-col ">
                  <label className="py-1" htmlFor="">
                    Status
                  </label>
                  <input
                    className="border-2 outline-none px-2 py-1 border-black"
                    type="text"
                    placeholder="pending or paid"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />
                </div>

                <div className=" flex flex-col ">
                  <label className="py-1" htmlFor="">
                    Due Date
                  </label>
                  <input
                    className="border-2 outline-none px-2 py-1 border-black"
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex flex-col ">
                  <label className="py-1" htmlFor="">
                    Amount
                  </label>
                  <input
                    className="border-2 outline-none px-2 py-1 border-black"
                    type="Number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                    }}
                  />
                </div>

                <button
                  className=" bg-black text-white py-2 mt-2"
                  onClick={async () => {
                    await addBill({
                      variables: {
                        newBillInput: {
                          amount,
                          dueDate,
                          status,
                          billType,
                          userId: user._id,
                        },
                      },
                    });
                  }}
                >
                  Add Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBillModel;
