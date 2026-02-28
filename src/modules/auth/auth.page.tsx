import React, { useState } from "react";
import { AuthService } from "./auth.service";
import { LoginForm } from "./components/LoginForm";
import { User, SignUpData } from "./auth.types";

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

      <div className="relative z-10 mb-10 text-center max-w-xs">
        <div className="mb-6 inline-block p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="w-24 h-24 flex items-center justify-center">
            {/* Representing the logo icon from the image */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-[#D4AF37]"
              fill="currentColor"
            >
              <rect x="15" y="50" width="15" height="35" rx="4" />
              <rect x="40" y="30" width="15" height="55" rx="4" />
              <path d="M65 10 L85 30 L75 30 L75 85 L65 85 L65 10 Z" />
              <path d="M15 90 L85 90 L85 85 L15 85 Z" className="opacity-50" />
            </svg>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-[0.15em] uppercase italic">
            CONT.
          </h1>
          <h1 className="text-4xl font-black text-[#D4AF37] tracking-[0.2em] uppercase italic">
            ANNY
          </h1>
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
