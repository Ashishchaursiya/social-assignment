import { useEffect, useState } from "react";
import { fetchSavedPosts } from "../firebase/firebase-functions";
import { useAuth } from "../hooks/useAuth";
import Post from "./Post";
import Loader from "./Loader";
import { PostInterFace } from "../utils/interface";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] =  useState<PostInterFace[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSavedPosts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const posts = await fetchSavedPosts(user.uid);
        setSavedPosts(posts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getSavedPosts();
  }, [user]);

  return (
    <div className="flex flex-col space-y-4 mt-4">
      {loading && <Loader />}

      {!loading && savedPosts.length === 0 ? (
        <p className="text-center text-lg">No saved posts found.</p>
      ) : (
        savedPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            currentUserId={user.uid}
            setLoading={setLoading}
          />
        ))
      )}
    </div>
  );
};

export default SavedPosts;
