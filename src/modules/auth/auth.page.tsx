import React, { useState } from "react";
import { AuthService } from "./auth.service";
import { LoginForm } from "./components/LoginForm";
import { User, SignUpData } from "./auth.types";
import logo from "../../assets/logo.png";

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (email: string, password: string) => {
    setError(null);
    const { user, error: authError } = await AuthService.signIn(
      email,
      password,
    );

    if (authError) {
      setError(authError);
    } else if (user) {
      onLogin(user);
    }
  };

  const handleSignUpSubmit = async (data: SignUpData) => {
    setError(null);
    const { user, error: authError } = await AuthService.signUp(data);

    if (authError) {
      setError(authError);
    } else if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-[#002B49] relative flex flex-col justify-center items-center p-4 py-12 overflow-hidden">
      {/* Background Decorative Elements to mimic the brand feel */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] opacity-5 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] opacity-5 blur-[120px]"></div>

      <div className="relative z-10 mb-10 text-center max-w-sm">
        <div className="mb-6 inline-block">
          <img
            src={logo}
            alt="CONT. ANNY Logo"
            className="w-48 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6 opacity-50"></div>

        <p className="text-blue-100/70 text-[10px] font-bold uppercase tracking-[0.25em] leading-relaxed">
          Sua empresa em boas mãos,
          <br />
          seu futuro sempre planejado.
        </p>
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm
          onSubmitLogin={handleLoginSubmit}
          onSubmitSignUp={handleSignUpSubmit}
          error={error}
        />
      </div>
    </div>
  );
}
