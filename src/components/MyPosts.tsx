import { useEffect, useState } from "react";
import { fetchMyPosts, deletePost } from "../firebase/firebase-functions";
import { useAuth } from "../hooks/useAuth";
import Post from "./Post";
import Loader from "./Loader";
import { PostInterFace } from "../utils/interface";
import { Link } from "react-router-dom";
import { TrashIcon } from "../utils/icons";

const MyPosts = () => {
  const [myPosts, setMyPosts] = useState<PostInterFace[]>([]);
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

  return <> 
    <div className="flex flex-wrap gap-10 sm:mt-4 p-3 sm:p-0">
      {loading && <Loader />}

      {myPosts.length === 0 && !loading ? (
        <p className="text-center text-lg">No posts found.</p>
      ) : (
        myPosts.map((post) => (
          <div key={post.id} className="relative w-full sm:w-auto mb-4">
            <Post
              post={post}
              currentUserId={user.uid}
              setLoading={setLoading}
            />
            {!loading && (
              <button
                onClick={() => handleDelete(post.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg cursor-pointer"
              >
                {TrashIcon()}
              </button>
            )}
          </div>
        ))
      )}
     
    </div>
      {!loading && (
        <div className="flex justify-center items-center">
          <Link
            to="/"
            className={`bg-blue-500 text-white text-center p-2 sm:hidden rounded-md w-[100px] mx-auto hover:bg-blue-600 transition cursor-pointer`}
          >
            Home
          </Link>
        </div>
      )}
  </>
};

export default MyPosts;
