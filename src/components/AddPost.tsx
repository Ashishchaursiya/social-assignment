import { useState } from "react";
import { addPostToFirestore } from "../firebase/firebase-functions";
import { toast } from "react-toastify";
import Loader from "./Loader";

const AddPost = ({ onPostAdded }: { onPostAdded: () => void }) => {
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/drcpultl3/upload";
  const CLOUDINARY_PRESET = "social";
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please upload an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_URL);

      const response = await fetch(import.meta.env.VITE_APP_CLOUDINARY_PRESET, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        const imageUrl = data.secure_url;

        await addPostToFirestore(imageUrl);

        toast.success("Post added successfully!");

        setImageFile(null);
        onPostAdded();
      } else {
        throw new Error("Image upload failed.");
      }
    } catch (err) {
      toast.error("Failed to add post. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-full py-4">
      {loading && <Loader />}
      <form
        onSubmit={handlePostSubmit}
        className="flex space-x-2 w-full max-w-sm"
      >
        <div className="w-full relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <button
            type="button"
            className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none hover:bg-gray-100"
          >
            {imageFile ? imageFile.name : "Select Image"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer px-4 py-2 text-white font-semibold rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } focus:outline-none`}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
