import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, useAuth } from "@clerk/clerk-react";

const Login = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <div className="flex min-h-full flex-1 justify-center text-center px-6 py-12 lg:px-8">
        <SignIn redirectUrl="/" afterSignInUrl="/" signUpUrl="/register" />
      </div>
    </>
  );
};

export default Login;
