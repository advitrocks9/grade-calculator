import Resend from "next-auth/providers/resend";
import { createClient } from "@supabase/supabase-js";
import type { NextAuthConfig } from "next-auth";

const IMPERIAL_LONG_RE = /^[a-z]+(\.[a-z]+)+\d{2}@imperial\.ac\.uk$/;

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export default {
  providers: [
    Resend({
      from: "JMC Grades <noreply@howcookedami.lol>",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = (user.email ?? "").toLowerCase();
      if (!IMPERIAL_LONG_RE.test(email)) return false;

      const { data } = await supabase()
        .from("allowed_emails")
        .select("email")
        .eq("email", email)
        .single();

      return !!data;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const { data } = await supabase()
          .from("allowed_emails")
          .select("name")
          .eq("email", user.email.toLowerCase())
          .single();

        if (data?.name) token.name = data.name;

        const match = user.email.match(/(\d{2})@/);
        if (match) {
          token.entryYear = 2000 + parseInt(match[1], 10);
        }
      }
      return token;
    },

    session({ session, token }) {
      session.user.entryYear = token.entryYear as number | undefined;
      if (token.name) session.user.name = token.name as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;
