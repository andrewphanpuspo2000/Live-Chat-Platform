"use client";
import PhotoUploadComponent from "@/components/PhotoUploadComponent";
import React, { useState } from "react";

function EditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
          <p className="text-gray-400">Update your profile information</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <form className="bg-gray-800 rounded-2xl shadow-lg p-8">
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
                      src={"/default-photo.jpg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload button */}
                  <PhotoUploadComponent
                    onPhotoUploaded={(url) => console.log(url)}
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
