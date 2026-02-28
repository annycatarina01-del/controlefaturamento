import React, { useEffect, useState } from "react";
import { User } from "../auth.types";
import { supabase } from "@/src/lib/supabase";
import {
  Check,
  X,
  Shield,
  Clock,
  Users,
  Pause,
  Play,
  UserX,
  Loader2,
} from "lucide-react";

export function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;

      const formattedUsers: User[] = (data || []).map((p: any) => ({
        id: p.id,
        email: "", // email is in auth.users, but for dashboard metadata we often use what's in profile or just display name
        user_metadata: {
          nome: p.nome,
          empresa: p.empresa,
          celular: p.celular,
          approved: p.approved,
          paused: p.paused,
          role: p.role,
        },
      }));

      // In a real scenario, we might need to join with auth.users to get emails
      // For now, we'll fetch profiles. If we need emails, we'd need a service role or a specific view/function.
      // But based on the current types, we'll manage with profiles.

      setPendingUsers(formattedUsers.filter((u) => !u.user_metadata?.approved && u.user_metadata?.role !== "admin"));
      setActiveUsers(formattedUsers.filter((u) => u.user_metadata?.approved || u.user_metadata?.role === "admin"));

      // Notify if there are pending users
      if (formattedUsers.some(u => !u.user_metadata?.approved && u.user_metadata?.role !== "admin")) {
        // This is a simple logic for the dash, we could add a state for notification if needed
      }
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ approved: true })
        .eq("id", userId);

      if (error) throw error;
      await fetchUsers();
      alert("Usuário aprovado com sucesso!");
    } catch (err) {
      alert("Erro ao aprovar usuário.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm("Deseja realmente recusar esta solicitação?")) return;
    setActionLoading(userId);
    try {
      // Typically rejection might mean deleting the profile or marking as rejected
      // For this system, we'll just delete the profile record
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;
      await fetchUsers();
    } catch (err) {
      alert("Erro ao recusar usuário.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePause = async (userId: string, currentPaused: boolean) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ paused: !currentPaused })
        .eq("id", userId);

      if (error) throw error;
      await fetchUsers();
    } catch (err) {
      alert("Erro ao alterar status do usuário.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTerminate = async (userId: string) => {
    if (!window.confirm("Deseja realmente encerrar o uso deste usuário?"))
      return;
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;
      await fetchUsers();
    } catch (err) {
      alert("Erro ao encerrar usuário.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Painel do Administrador
          </h1>
          <p className="text-gray-500">
            Gerencie as solicitações e usuários do sistema.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === "pending"
            ? "bg-white shadow-sm text-indigo-600"
            : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <Clock size={16} />
          Solicitações ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === "active"
            ? "bg-white shadow-sm text-indigo-600"
            : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <Users size={16} />
          Usuários Ativos ({activeUsers.length})
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === "pending" ? (
          <>
            <div className="p-6 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Solicitações Pendentes
              </h2>
            </div>
            {pendingUsers.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic">
                Nenhuma solicitação pendente.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      <th className="px-6 py-4">Usuário</th>
                      <th className="px-6 py-4">Empresa</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pendingUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              {user.user_metadata?.nome}
                            </span>
                            <span className="text-xs text-gray-400">
                              {user.user_metadata?.celular}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {user.user_metadata?.empresa}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReject(user.id)}
                              disabled={!!actionLoading}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              <X size={20} />
                            </button>
                            <button
                              onClick={() => handleApprove(user.id)}
                              disabled={!!actionLoading}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                            >
                              {actionLoading === user.id && <Loader2 size={12} className="animate-spin" />}
                              Aprovar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="p-6 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Usuários Ativos
              </h2>
            </div>
            {activeUsers.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic">
                Nenhum usuário ativo.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      <th className="px-6 py-4">Usuário</th>
                      <th className="px-6 py-4">Empresa</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              {user.user_metadata?.nome}
                            </span>
                            {user.user_metadata?.role === "admin" && (
                              <span className="text-[10px] text-indigo-600 font-bold uppercase">Admin</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {user.user_metadata?.empresa}
                        </td>
                        <td className="px-6 py-4">
                          {user.user_metadata?.paused ? (
                            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                              Pausado
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                              Ativo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.user_metadata?.role !== "admin" && (
                              <>
                                <button
                                  onClick={() => handleTogglePause(user.id, !!user.user_metadata?.paused)}
                                  disabled={!!actionLoading}
                                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${user.user_metadata?.paused
                                    ? "text-green-600 hover:bg-green-50"
                                    : "text-orange-500 hover:bg-orange-50"
                                    }`}
                                  title={user.user_metadata?.paused ? "Retomar" : "Pausar"}
                                >
                                  {actionLoading === user.id ? (
                                    <Loader2 size={20} className="animate-spin" />
                                  ) : user.user_metadata?.paused ? (
                                    <Play size={20} />
                                  ) : (
                                    <Pause size={20} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleTerminate(user.id)}
                                  disabled={!!actionLoading}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                  title="Encerrar Uso"
                                >
                                  <UserX size={20} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
