import { useState, useEffect, useCallback } from "react";
import { fetchPosts } from "../firebase/firebase-functions";
import Post from "./Post";
import { auth } from "../firebase/firebase-config";
import Loader from "./Loader";
import AddPost from "./AddPost";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { PostInterFace } from "../utils/interface";
 
const Feeds = () => {
  const userId = auth?.currentUser?.uid;
  const [posts, setPosts] = useState<PostInterFace[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPosts = useCallback(
    async (resetPosts = false) => {
      setLoading(true);

      try {
        const { posts: newPosts, lastVisible: newLastVisible } =
          await fetchPosts(resetPosts ? null : lastVisible);
        
        if (newPosts.length === 0) {
          //setHasMore(false);
        } else {
          setPosts((prev: PostInterFace[]) =>
            [...prev, ...newPosts].filter(
              (post, index, self) =>
                index === self.findIndex((p) => p.id === post.id)
            )
          );

          setLastVisible(newLastVisible);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, lastVisible]
  );

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostAdded = () => {
    loadPosts(true);
  };

  return (
    <>
      {userId && <AddPost onPostAdded={handlePostAdded} />}

      <div className="flex justify-center items-center py-4 px-6">
        {loading && <Loader />}
        <div className="w-full max-w-3xl feeds-container">
          {posts.length === 0 && !loading && (
            <p className="text-center text-lg">No posts to display.</p>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className="mb-6 p-4 bg-white  rounded-lg transition-all duration-300"
            >
              <Post
                post={post}
                currentUserId={userId}
                setLoading={setLoading}
              />
            </div>
          ))}
          { !loading && posts.length !== 0 && (
            <p className="text-center text-lg">No more posts to load.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Feeds;
