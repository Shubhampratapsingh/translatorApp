import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignUp, useAuth } from "@clerk/clerk-react";

const Register = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    } else {
      navigate("/register");
    }
  }, [navigate]);

  return (
    <>
      <div className="flex min-h-full flex-1 justify-center text-center px-6 py-12 lg:px-8">
        <SignUp redirectUrl="/" afterSignUpUrl="/" signInUrl="/login" />
      </div>
    </>
  );
};

export default Register;
