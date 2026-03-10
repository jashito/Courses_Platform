import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "./supabaseServer";

export type UserRole = "admin" | "student";

export async function requireRole(
  ctx: GetServerSidePropsContext,
  allowedRoles: UserRole[]
): Promise<GetServerSidePropsResult<Record<string, never>>> {
  const supabase = getSupabaseServerClient(
    ctx.req as NextApiRequest,
    ctx.res as NextApiResponse
  );

  const { data: authData, error } = await supabase.auth.getUser();
  if (error || !authData?.user) {
    return {
      redirect: {
        destination: `/login?returnTo=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false
      }
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .single();

  const role = (profile?.role ?? "student") as UserRole;
  if (!allowedRoles.includes(role)) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return { props: {} };
}