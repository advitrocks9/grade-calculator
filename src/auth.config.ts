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

function magicLinkHtml(url: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0A0A0B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0B;padding:40px 0;">
    <tr><td align="center">
      <table width="400" cellpadding="0" cellspacing="0" style="max-width:400px;width:100%;">
        <tr><td style="padding:0 24px;">

          <div style="height:1px;background:linear-gradient(to right,transparent,rgba(129,140,248,0.3),transparent);margin-bottom:32px;"></div>

          <p style="margin:0 0 4px;font-size:20px;font-weight:600;color:#F5F5F7;">my grades</p>
          <p style="margin:0 0 32px;font-size:13px;color:#63636E;">howcookedami.lol</p>

          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#A1A1AA;">
            Tap the button below to sign in. This link expires in 24 hours.
          </p>

          <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="background-color:#818CF8;border-radius:10px;">
              <a href="${url}" target="_blank" style="display:inline-block;padding:12px 32px;font-size:14px;font-weight:500;color:#0A0A0B;text-decoration:none;">
                Sign in
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 12px;font-size:12px;color:#63636E;line-height:1.5;">
            If the button doesn't work, copy this link:
          </p>
          <p style="margin:0 0 32px;font-size:12px;color:#818CF8;word-break:break-all;line-height:1.5;">
            ${url}
          </p>

          <div style="height:1px;background-color:#252529;margin-bottom:20px;"></div>

          <p style="margin:0;font-size:11px;color:#63636E;line-height:1.5;">
            If you didn't request this, ignore this email.
          </p>

        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default {
  providers: [
    Resend({
      from: "my grades <auth@howcookedami.lol>",
      async sendVerificationRequest({ identifier, url, provider }) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: identifier,
            subject: "Sign in to my grades",
            html: magicLinkHtml(url),
          }),
        });
        if (!res.ok) {
          throw new Error(`Resend error: ${await res.text()}`);
        }
      },
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
        const email = user.email.toLowerCase();
        const db = supabase();

        const { data } = await db
          .from("allowed_emails")
          .select("name")
          .eq("email", email)
          .single();

        if (data?.name) token.name = data.name;

        const match = email.match(/(\d{2})@/);
        const entryYear = match ? 2000 + parseInt(match[1], 10) : undefined;
        if (entryYear) token.entryYear = entryYear;

        await db.from("profiles").upsert(
          {
            id: email,
            email,
            name: data?.name ?? email,
            course: "JMC",
            entry_year: entryYear ?? 2025,
          },
          { onConflict: "id" },
        );
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
