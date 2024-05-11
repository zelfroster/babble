import axios from "../../api/axios";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface FormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const initialFormValues = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormValues({ ...formValues, [name]: value });
  };
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    axios
      .post("/signup", {
        username: formValues?.username,
        email: formValues?.email,
        firstName: formValues?.firstName,
        lastName: formValues?.lastName,
        password: formValues?.password,
        confirmPassword: formValues?.confirmPassword,
      })
      .then((res) => {
        console.log({ res });
        if (res.status === 200 && res.data?.message === "Sign up successful") {
          navigate("/signin");
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
          <p className="text-neutral-200 mb-6 text-2xl font-medium">Sign Up</p>
          <Input
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            placeholder="Enter a unique username"
          />
          <Input
            type="text"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            type="text"
            name="firstName"
            value={formValues?.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
          <Input
            type="text"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            placeholder="Enter your lastName"
          />
          <Input
            type="text"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <Input
            type="text"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            placeholder="Enter your password again"
          />
          <Button type="submit">Log In</Button>
        </form>
        <div className="flex gap-2 mt-4">
          <p className="text-neutral-400">Already have an account?</p>
          <Button
            variant={"link"}
            onClick={() => navigate("/signin")}
            className="py-0 pl-1 h-6 font-bold flex gap-1"
          >
            Sign in now <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
