import React, { useState } from "react";
import { SignUpData } from "../auth.types";

interface LoginFormProps {
  onSubmitLogin: (email: string, password: string) => Promise<void>;
  onSubmitSignUp: (data: SignUpData) => Promise<void>;
  error: string | null;
}

export function LoginForm({
  onSubmitLogin,
  onSubmitSignUp,
  error,
}: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [celular, setCelular] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isLogin && password !== confirmPassword) {
      setValidationError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await onSubmitLogin(email, password);
      } else {
        await onSubmitSignUp({ email, password, nome, empresa, celular });
      }
    } finally {
      setLoading(false);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-[#002137]">
          {isLogin ? "Acesso Restrito" : "Novo Cadastro"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {isLogin
            ? "Identifique-se para continuar"
            : "Preencha os dados abaixo"}
        </p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-sm"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">
                Empresa
              </label>
              <input
                type="text"
                required
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-sm"
                placeholder="Nome da sua empresa"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">
                Celular
              </label>
              <input
                type="tel"
                required
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-sm"
                placeholder="(00) 00000-0000"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">
            E-mail Corporativo
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-sm"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">
            Senha de Acesso
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-sm"
            placeholder="••••••••"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 ml-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#002137] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#003d66] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 mt-6 border-b-4 border-blue-950 active:border-b-0 active:translate-y-1"
        >
          {loading
            ? "Processando..."
            : isLogin
              ? "Entrar no Sistema"
              : "Finalizar Cadastro"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setValidationError(null);
          }}
          className="text-[11px] text-[#002137] hover:text-indigo-800 font-bold uppercase tracking-wider"
        >
          {isLogin
            ? "Solicitar Acesso / Cadastrar"
            : "Já possui acesso? Fazer Login"}
        </button>
      </div>
    </div>
  );
}
