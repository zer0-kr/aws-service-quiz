"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function setNickname(formData: FormData) {
  const nickname = formData.get("nickname") as string;

  if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 20) {
    return { error: "Nickname must be 2-20 characters" };
  }

  // Only allow alphanumeric, Korean, Japanese, spaces, underscores, hyphens
  const validPattern = /^[\w 가-힣ぁ-んァ-ヶー\-]+$/u;
  if (!validPattern.test(nickname.trim())) {
    return { error: "Nickname contains invalid characters" };
  }

  const supabase = await createClient();

  // Parallel: getUser + check nickname uniqueness (independent queries)
  const [userResult, existingResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("profiles")
      .select("id")
      .eq("nickname", nickname.trim())
      .single(),
  ]);

  const user = userResult.data.user;
  if (!user) {
    return { error: "Not authenticated" };
  }

  if (existingResult.data && existingResult.data.id !== user.id) {
    return { error: "Nickname is already taken" };
  }

  // Upsert profile
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    nickname: nickname.trim(),
    avatar_url: user.user_metadata?.avatar_url || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Nickname is already taken" };
    }
    return { error: "Failed to save nickname" };
  }

  redirect("/play");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
