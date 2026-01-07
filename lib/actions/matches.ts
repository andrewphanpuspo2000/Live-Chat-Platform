"use server";

import { UserProfile } from "@/app/Profile/page";
import { createClient } from "../supabase/server";

export const getPotentialMatches = async (): Promise<UserProfile[]> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }
  const { data: potentialMatches, error: fetchPotentialError } = await supabase
    .from("users")
    .select("*")
    .neq("id", user.id)
    .limit(50);

  if (fetchPotentialError) throw new Error("Error fetch potential matches");

  const { data: userPref, error: userPrefError } = await supabase
    .from("users")
    .select("preferences")
    .eq("id", user.id)
    .single();

  if (userPrefError) throw new Error("Error fetch user preferences");

  const currentUserPreferences = userPref.preferences as any;
  const genderPreferences = currentUserPreferences?.gender_preference || [];

  const filterMatch =
    potentialMatches
      .filter((match) => {
        if (!genderPreferences || genderPreferences.length == 0) {
          return true;
        }
        return genderPreferences.includes(match.gender);
      })
      .map((match) => ({
        id: match.id,
        full_name: match.full_name,
        username: match.username,
        email: "",
        gender: match.gender,
        birthdate: match.birthdate,
        bio: match.bio,
        avatar_url: match.avatar_url,
        preferences: match.preferences,
        location_lat: undefined,
        location_lng: undefined,
        last_active: new Date().toISOString(),
        is_verified: true,
        is_online: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) || [];

  return filterMatch;
};
