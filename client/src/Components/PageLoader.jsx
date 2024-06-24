import loader from "../Assets/fade-stagger-squares.svg";

const PageLoader = () => {
  return (
    <div className=" flex h-screen  w-full items-center justify-center">
      <img src={loader} alt="" height={100} width={100} />{" "}
    </div>
  );
};

export default PageLoader;
