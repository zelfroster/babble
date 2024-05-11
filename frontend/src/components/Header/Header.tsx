import { Button } from "@components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className="flex justify-between items-center py-2 mb-4">
        <h1
          className="font-bold text-2xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          Babble
        </h1>
        <div className="flex gap-x-4">
          <Button className="px-6" onClick={() => navigate("/signin")}>
            Log In
          </Button>
          <Button
            className="px-7"
            variant={"outline"}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
