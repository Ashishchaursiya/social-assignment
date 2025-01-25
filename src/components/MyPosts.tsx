import { useEffect, useState } from "react";
import { fetchMyPosts, deletePost } from "../firebase/firebase-functions";
import { useAuth } from "../hooks/useAuth";
import Post from "./Post";
import Loader from "./Loader";

const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMyPosts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const posts = await fetchMyPosts(user.uid);
        setMyPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getMyPosts();
  }, [user]);

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setLoading(true);
      try {
        await deletePost(postId);
        setMyPosts((prev) => prev.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4 mt-4">
      {loading && <Loader />}

      {myPosts.length === 0 && !loading ? (
        <p className="text-center text-lg">No posts found.</p>
      ) : (
        myPosts.map((post) => (
          <div key={post.id} className="relative mb-4">
            <Post
              post={post}
              currentUserId={user.uid}
              setLoading={setLoading}
            />
            {!loading && (
              <button
                onClick={() => handleDelete(post.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg"
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyPosts;
