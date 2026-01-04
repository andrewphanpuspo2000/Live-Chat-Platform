"use client";
import PhotoUploadComponent from "@/components/PhotoUploadComponent";
import { getProfileAction, updateUserProfile } from "@/lib/actions/profile";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function EditPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    gender: "male" as "male" | "female" | "other",
    birthdate: "",
    avatar_url: "",
  });
  const [error, setError] = useState<string | null>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        router.push("/Profile");
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch {
      setError("Failed to update user profile.");
    } finally {
      setSaving(false);
    }
  }
  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getProfileAction();
        if (profileData) {
          setFormData({
            full_name: profileData.full_name || "",
            username: profileData.username || "",
            bio: profileData.bio || "",
            gender: profileData.gender || "male",
            birthdate: profileData.birthdate || "",
            avatar_url: profileData.avatar_url || "",
          });
        }
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your profile information</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <form
            className="bg-gray-800 rounded-2xl shadow-lg p-8"
            onSubmit={handleFormSubmit}
          >
            {/* Profile picture */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Profile Picture
              </label>

              <div className="flex items-center space-x-6">
                {/* Wrapper */}
                <div className="relative inline-block">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700">
                    <img
                      src={formData.avatar_url || "/default-photo.jpg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload button */}
                  <PhotoUploadComponent
                    onPhotoUploaded={(url) =>
                      setFormData((prev) => ({ ...prev, avatar_url: url }))
                    }
                  />
                </div>

                {/* Text */}
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Upload a new profile picture
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </div>
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 datext-gray-300 mb-2"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="birthdate"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Birthday *
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-700 text-white"
                />
              </div>
            </div>

            <div className="mb-8">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                About Me *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-700 text-white resize-none"
                placeholder="Tell others about yourself..."
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
