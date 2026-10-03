"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function resetCard(cardCode: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reset_card", { p_code: cardCode });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard");
  return { ok: true, message: "" };
}