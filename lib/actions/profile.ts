"use server";

import { UserProfile } from "@/app/Profile/page";
import { createClient } from "../supabase/server";

export const getProfileAction = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profiles:", error);
    return null;
  }

  return profile;
};

export async function uploadProfilePhoto(file: File) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("Profile_Tinder")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("Profile_Tinder").getPublicUrl(fileName);
  return { success: true, url: publicUrl };
}

export async function updateUserProfile(formData: Partial<UserProfile>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const { error } = await supabase
    .from("users")
    .update({
      full_name: formData.full_name,
      username: formData.username,
      bio: formData.bio,
      gender: formData.gender,
      birthdate: formData.birthdate,
      avatar_url: formData.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
