import Header from "@components/Header/Header";
import { Route, Routes } from "react-router-dom";
import SignInForm from "./routes/SignInForm/SignInForm";
import Home from "./routes/Home/Home";
import SignUpForm from "./routes/SignUpForm/SignUpForm";
import Chat from "./routes/Chat/Chat";

function App() {
  return (
    <div className="container flex flex-col pt-6 pb-8 dark min-h-screen">
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
