import { supabase } from "@/src/lib/supabase";
import { SignUpData, User } from "./auth.types";

export const AuthService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    // Get up-to-date profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        user_metadata: {
          ...data.user.user_metadata,
          ...profile,
        },
      } as User,
      error: null,
    };
  },

  async signUp(data: SignUpData) {
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nome: data.nome,
          empresa: data.empresa,
          celular: data.celular,
          approved: false,
          role: "user",
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return {
      user: {
        id: result.user?.id || "",
        email: result.user?.email || "",
        user_metadata: result.user?.user_metadata,
      } as User,
      error: null,
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  },

  async getCurrentUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      // Get up-to-date profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      return {
        user: {
          id: session.user.id,
          email: session.user.email!,
          user_metadata: {
            ...session.user.user_metadata,
            ...profile,
          },
        } as User,
      };
    }
    return { user: null };
  },

  async getPendingCount() {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("approved", false)
      .neq("role", "admin");

    return { count, error };
  }
};
