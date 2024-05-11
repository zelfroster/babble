import axios from "../../api/axios";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";

export interface FormValues {
  email: string;
  password: string;
}

const initialFormValues = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  const { setCurrentUser } = useContext(UserContext);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormValues({ ...formValues, [name]: value });
  };
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    axios
      .post("/signin", {
        email: formValues?.email,
        password: formValues?.password,
      })
      .then((res) => {
        console.log({ res });
        if (res.status === 200) {
          setCurrentUser(res?.data?.user);
          localStorage.setItem("token", res?.data?.user?.token);
          navigate("/chat");
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  };
  return (
    <div className="flex items-center justify-center border border-white/20 border-solid rounded-lg grow">
      <div className="flex flex-col w-[400px] gap-4">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
          <p className="text-neutral-200 mb-6 text-2xl font-medium">Sign In</p>
          <Input
            type="text"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            type="text"
            name="password"
            id="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <p className="text-neutral-400 mb-2">Forgot password?</p>
          <Button type="submit">Log In</Button>
        </form>
        <div className="flex gap-2 mt-4">
          <p className="text-neutral-400">Don't have an account?</p>
          <Button
            variant={"link"}
            onClick={() => navigate("/signup")}
            className="py-0 pl-1 h-6 font-bold flex gap-1"
          >
            Sign up now <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
