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
  console.log("Potential matches from server:", potentialMatches);
  return filterMatch;
};

export async function likeUser(toUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { error: likeError } = await supabase.from("likes").insert({
    from_user_id: user.id,
    to_user_id: toUserId,
  });

  if (likeError) {
    throw new Error("Failed to create like");
  }

  const { data: existingLike, error: checkError } = await supabase
    .from("likes")
    .select("*")
    .eq("from_user_id", toUserId)
    .eq("to_user_id", user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error("Failed to check for match");
  }

  if (existingLike) {
    const { data: matchedUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", toUserId)
      .single();

    if (userError) {
      throw new Error("Failed to fetch matched user");
    }

    return {
      success: true,
      isMatch: true,
      matchedUser: matchedUser as UserProfile,
    };
  }

  return { success: true, isMatch: false };
}
