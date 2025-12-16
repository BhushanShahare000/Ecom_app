import Image from "next/image";
import LoginPage from "./login/page";
import RegisterPage from "./register/page";

export default function Home() {
  return (
    <div>
      {/* <RegisterPage /> */}
      <LoginPage />
    </div>

  );
}
