'use client';

import AvatarViewer from '@/components/avatar/AvatarViewer';
import React, { useState } from 'react';

const AvatarPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null); // Clear any previous errors
      setAvatarId(null); // Clear previous avatar ID
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://localhost:8000/generate-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAvatarId(data.avatar_id);
      console.log("Avatar generation successful:", data);
    } catch (err: any) {
      setError(`Failed to generate avatar: ${err.message}`);
      console.error("Error generating avatar:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Your Customizable Avatar</h1>
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <label htmlFor="avatar-upload" className="block text-white text-sm font-bold mb-2">Upload Image for Avatar Generation</label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {imagePreview && (
          <div className="mb-4">
            <h2 className="text-white text-lg font-bold mb-2">Image Preview:</h2>
            <img src={imagePreview} alt="Image Preview" className="max-w-full h-auto rounded-lg" />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedImage || loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Avatar"}
        </button>

        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
        {avatarId && <p className="text-green-500 mt-4">Avatar Generated! ID: {avatarId}</p>}

        <AvatarViewer />
      </div>
    </div>
  );
};

export default AvatarPage;
