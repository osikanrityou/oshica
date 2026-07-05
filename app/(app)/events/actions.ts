"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const FREE_PER_OSHI_LIMIT = 3;

export async function createEvent(formData: FormData) {
  const title = formData.get("title");
  const eventDate = formData.get("eventDate");
  const deadline = formData.get("deadline");
  const memo = formData.get("memo");
  const oshiId = formData.get("oshiId");

  if (
    typeof title !== "string" ||
    title.trim().length === 0 ||
    typeof oshiId !== "string" ||
    oshiId.length === 0
  ) {
    redirect("/events/new");
  }

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { count, error: countError } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("oshi_id", oshiId);

  if (countError) throw new Error(countError.message);

  if ((count ?? 0) >= FREE_PER_OSHI_LIMIT) {
    redirect("/events/new");
  }

  const { error } = await supabase.from("events").insert({
    title: title.trim(),
    event_date:
      typeof eventDate === "string" && eventDate.length > 0
        ? eventDate
        : null,
    deadline:
      typeof deadline === "string" && deadline.length > 0 ? deadline : null,
    memo:
      typeof memo === "string" && memo.trim().length > 0 ? memo.trim() : null,
    oshi_id: oshiId,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/events");
  revalidatePath("/oshis");
  revalidatePath("/dashboard");

  redirect("/events");
}

export async function updateEvent(formData: FormData) {
  const eventId = formData.get("eventId");
  const title = formData.get("title");
  const eventDate = formData.get("eventDate");
  const deadline = formData.get("deadline");
  const memo = formData.get("memo");
  const oshiId = formData.get("oshiId");

  if (typeof eventId !== "string" || typeof title !== "string") return;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: currentEvent } = await supabase
    .from("events")
    .select("oshi_id")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .single();

  const nextOshiId =
    typeof oshiId === "string" && oshiId.length > 0 ? oshiId : null;

  if (nextOshiId && currentEvent?.oshi_id !== nextOshiId) {
    const { count, error: countError } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("oshi_id", nextOshiId);

    if (countError) throw new Error(countError.message);

    if ((count ?? 0) >= FREE_PER_OSHI_LIMIT) {
      redirect(`/events/${eventId}/edit`);
    }
  }

  await supabase
    .from("events")
    .update({
      title: title.trim(),
      event_date:
        typeof eventDate === "string" && eventDate.length > 0
          ? eventDate
          : null,
      deadline:
        typeof deadline === "string" && deadline.length > 0 ? deadline : null,
      memo:
        typeof memo === "string" && memo.trim().length > 0 ? memo.trim() : null,
      oshi_id: nextOshiId,
    })
    .eq("id", eventId)
    .eq("user_id", user.id);

  revalidatePath("/events");
  revalidatePath("/oshis");
  revalidatePath("/dashboard");

  redirect("/events");
}

export async function deleteEvent(formData: FormData) {
  const eventId = formData.get("eventId");

  if (typeof eventId !== "string") return;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("user_id", user.id);

  revalidatePath("/events");
  revalidatePath("/oshis");
  revalidatePath("/dashboard");

  redirect("/events");
}