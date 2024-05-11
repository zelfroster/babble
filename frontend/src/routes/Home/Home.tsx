import { Button } from "@components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-12 items-center justify-center border border-white/20 border-solid rounded-lg grow">
      <h1 className="text-8xl text-center font-extrabold flex flex-col">
        <span className="text-3xl font-thin text-neutral-500">
          Welcome to the
        </span>{" "}
        Homepage of Babble
      </h1>
      <Button
        size={"lg"}
        className="flex gap-2 text-md"
        onClick={() => navigate("/signin")}
      >
        Join the Chat today <ArrowRightIcon className="" />
      </Button>
    </div>
  );
};

export default Home;
