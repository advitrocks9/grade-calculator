import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/");

  const { error } = await searchParams;
  redirect(error ? `/?login=true&error=${error}` : "/?login=true");
}
