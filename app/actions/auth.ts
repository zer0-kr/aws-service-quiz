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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if nickname is taken
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname.trim())
    .single();

  if (existing && existing.id !== user.id) {
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
