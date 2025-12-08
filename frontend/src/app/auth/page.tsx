import { api, authApi } from "@/api/client";
import Login from "@/components/user/login/Login";
import Signup from "@/components/user/signup/Signup";
import { FormEvent } from "react";

interface AuthPageProps {
  searchParams?: {
    view?: string;
  };
}

export default function AuthPage({ searchParams = {} }: AuthPageProps) {
  const view = searchParams.view;

  switch (view) {
    case "signup":
      return <Signup />;
    case "login":
    default:
      return <Login />;
  }
}
