"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const FREE_EVENTS_LIMIT = 3;

export async function createEvent(formData: FormData) {
  const title = formData.get("title");
const eventDate = formData.get("eventDate");
const deadline = formData.get("deadline");
const memo = formData.get("memo");
const oshiId = formData.get("oshiId");
  if (typeof title !== "string" || title.trim().length === 0) {
    redirect("/events/new");
  }
const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= FREE_EVENTS_LIMIT) {
    redirect("/events/new");
  }
const { error } = await supabase.from("events").insert({
  title: title.trim(),
  event_date:
    typeof eventDate === "string" && eventDate.length > 0
      ? eventDate
      : "2026-01-01",
  deadline:
    typeof deadline === "string" && deadline.length > 0
      ? deadline
      : null,
  memo: typeof memo === "string" ? memo : "",
  oshi_id:
  typeof oshiId === "string" && oshiId.length > 0
    ? oshiId
    : null,
  user_id: user.id,
});

if (error) {
  throw new Error(error.message);
}
  revalidatePath("/events");
  redirect("/events");
}

export async function updateEvent(formData: FormData) {
  const eventId = formData.get("eventId");
  const title = formData.get("title");
  const eventDate = formData.get("eventDate");
  const deadline = formData.get("deadline");
  const memo = formData.get("memo");
  const oshiId = formData.get("oshiId");

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("events")
    .update({
      title,
      event_date:
        typeof eventDate === "string" && eventDate.length > 0
          ? eventDate
          : "2026-01-01",
      deadline:
        typeof deadline === "string" && deadline.length > 0
          ? deadline
          : null,
      memo: typeof memo === "string" ? memo : "",
      oshi_id:
  typeof oshiId === "string" && oshiId.length > 0
    ? oshiId
    : null,
    })
    .eq("id", eventId)
    .eq("user_id", user.id);

  revalidatePath("/events");
  revalidatePath("/dashboard");
  redirect("/events");
}

export async function deleteEvent(formData: FormData) {
  const eventId = formData.get("eventId");

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("user_id", user.id);

  revalidatePath("/events");
  redirect("/events");
}