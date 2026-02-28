/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { TransacoesPage } from "./modules/transacoes/transacoes.page";
import { AuthPage } from "./modules/auth/auth.page";
import { AuthService } from "./modules/auth/auth.service";
import { User } from "./modules/auth/auth.types";
import { AdminDashboard } from "./modules/auth/components/AdminDashboard";
import { LogOut, Shield, LayoutDashboard, Pause } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"app" | "admin">("app");
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.role === "admin") {
      const checkPending = async () => {
        const { count } = await AuthService.getPendingCount();
        setHasPending((count || 0) > 0);
      };
      checkPending();
      // Check every minute
      const interval = setInterval(checkPending, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    AuthService.getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await AuthService.signOut();
    setUser(null);
    setView("app");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  const isAdmin = user.user_metadata?.role === "admin";
  const isApproved = user.user_metadata?.approved === true;
  const isPaused = user.user_metadata?.paused === true;

  if (!isApproved && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#002B49] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#D4AF37] text-[#002B49] rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-pulse">
          <Shield size={40} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">
          Acesso Pendente
        </h1>
        <p className="text-blue-100/60 max-w-sm leading-relaxed mb-8">
          Olá, <span className="text-white font-bold">{user.user_metadata?.nome}</span>.
          Sua solicitação de acesso foi enviada com sucesso.
          Por favor, aguarde a liberação do administrador para acessar o sistema.
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sair da Conta
        </button>
      </div>
    );
  }

  if (isPaused && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#002B49] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <Pause size={40} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">
          Acesso Suspenso
        </h1>
        <p className="text-blue-100/60 max-w-sm leading-relaxed mb-8">
          Olá, <span className="text-white font-bold">{user.user_metadata?.nome}</span>.
          Seu acesso ao sistema foi temporariamente pausado pelo administrador.
          Entre em contato para mais informações.
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sair da Conta
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#002B49] text-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="font-black text-xs italic">CA</span>
            </div>
            <span className="font-bold text-gray-900 uppercase tracking-tighter">Cont. Anny</span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                <button
                  onClick={() => setView("app")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${view === "app" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <LayoutDashboard size={14} />
                  Sistema
                </button>
                <button
                  onClick={() => setView("admin")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${view === "admin" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <Shield size={14} />
                  Admin
                  {hasPending && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="py-4">
        {view === "admin" && isAdmin ? (
          <AdminDashboard />
        ) : (
          <TransacoesPage user={user} />
        )}
      </main>
    </div>
  );
}
