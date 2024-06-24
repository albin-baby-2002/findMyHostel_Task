import { gql, useMutation } from '@apollo/client';
import React from 'react'
import toast from 'react-hot-toast';

const MARK_BILL_PAID = gql`
  mutation markPaid($markBillPaidId: ID!) {
    markBillPaid(id: $markBillPaidId) {
      message
      bill {
        amount
        billType
        status
        dueDate
        _id
      }
    }
  }
`;




const BillsComponent = ({bills,refetch}) => {
    
      const [markBillPaid, { data, loading, error }] = useMutation(MARK_BILL_PAID, {
        onError(err) {
          console.log(err);
          toast.error(err.message)
        },
        onCompleted(data) {
        ;
          console.log(data, "mark bill paid");
          
          refetch()
          toast.success('successfull marked paid')
         
        },
      });
     
  return (
    <div className=" text-sm w-4/5 mx-auto bg-slate-200 rounded-md pb-4 font-Sen">
      <div className=" grid py-4 px-7 border-b border-black  grid-cols-[200px,repeat(4,1fr),130px]">
        <p>BillID</p>
        <p className=" text-center">Bill Type</p>
        <p className=" text-center">Status</p>
        <p className=" text-center">Due Date</p>
        <p className=" text-right"> Amount</p>
        <p className=" text-right"> Actions</p>
      </div>

      {bills.map((bill, idx) => (
        <div key={idx}>
          <div
            className=" border-b py-4 px-7  border-black "
            onClick={() => {}}
          >
            <div className=" grid   grid-cols-[200px,repeat(4,1fr),130px]">
              <p>{bill._id}</p>
              <p className=" text-center">{bill.billType}</p>
              <p className=" text-center">{bill.status}</p>
              <p className=" text-center">
                {new Date(parseInt(bill.dueDate)).toLocaleDateString("en-US")}
              </p>
              <p className=" text-right">{bill.amount}</p>
              <p className=" text-right">
                <div className=" flex justify-end ">
                  <button
                    disabled={bill.status === "paid"}
                    className={` py-1 px-1 ${
                      bill.status === "paid"
                        ? ""
                        : " hover:bg-slate-900 hover:text-white hover:font-semibold"
                    }`}
                    onClick={async () => {
                      await markBillPaid({
                        variables: { markBillPaidId: bill._id },
                      });
                    }}
                  >
                    Mark Paid
                  </button>
                </div>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BillsComponent