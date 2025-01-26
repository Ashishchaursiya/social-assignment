import React, { useState, useEffect } from "react";
import {
  toggleLike,
  addNestedComment,
  fetchComments,
  savePost,
  unsavePost,
} from "../firebase/firebase-functions";
import { useAuth } from "../hooks/useAuth";
import {
  BookMarked,
  CommentIcon,
  LikedIcon,
  NotBookMarked,
  NotLikedIcon,
} from "../utils/icons";

interface Comment {
  id?: string;
  text: string;
  userId: string;
  username?: string;
  parentId?: string | null;
  createdAt: any;
  replies?: Comment[];
}

const CommentComponent: React.FC<{
  comment: Comment;
  postId: string;
  onReply: (parentId: string, text: string) => void;
}> = ({ comment, postId, onReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { user } = useAuth();

  const handleReply = () => {
    if (!user || !replyText.trim()) return;

    onReply(comment.id!, replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="ml-4 mt-2 border-l-2 pl-2">
      <div>
        <p className="font-medium">{comment.username}</p>
        <p>{comment.text}</p>
        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="text-sm text-blue-500 cursor-pointer"
        >
          Reply
        </button>
      </div>

      {showReplyInput && (
        <div className="mt-2 mx-4">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={handleReply}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Post Reply
          </button>
        </div>
      )}

      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentComponent
            key={reply.id}
            comment={reply}
            postId={postId}
            onReply={onReply}
          />
        ))}
    </div>
  );
};

const Post = ({
  post,
  currentUserId,
  setLoading,
}: {
  post: any;
  currentUserId: string | null | undefined;
  setLoading: (loading: boolean) => void;
}) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(likes.includes(currentUserId));
  const [isSaved, setIsSaved] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user && post.savedBy) {
      setIsSaved(post.savedBy.includes(user.uid));
    }
  }, [user, post.savedBy]);

  // Handle Like Functionality
  const handleLike = async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      const updatedLikes = await toggleLike(post.id, currentUserId);
      setLikes(updatedLikes);
      setIsLiked(updatedLikes?.includes(currentUserId));
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Comments View
  const toggleComments = async () => {
    if (!currentUserId) return;
    setShowComments((prev) => !prev);
    if (!showComments) {
      const fetchedComments = await fetchComments(post.id);
      setComments(fetchedComments);
    }
  };

  // Handle Save Post
  const handleSavePost = async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      if (isSaved) {
        await unsavePost(post.id, user.uid);
        setIsSaved(false);
      } else {
        await savePost(post.id, user.uid);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new comment (top-level or nested)
  const handleAddComment = async (
    parentId: string | null = null,
    commentText?: string
  ) => {
    const text = commentText || newComment;
    if (!user || !text.trim()) return;

    setLoading(true);
    try {
      const createdComment = await addNestedComment(
        post.id,
        parentId,
        text,
        user.uid,
        user.displayName || "Anonymous"
      );

      const updateNestedComments = (commentsList: Comment[]): Comment[] => {
        return commentsList.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), createdComment],
            };
          }

          if (comment.replies) {
            return {
              ...comment,
              replies: updateNestedComments(comment.replies),
            };
          }

          return comment;
        });
      };

      if (parentId) {
        const updatedComments = updateNestedComments(comments);
        setComments(updatedComments);
      } else {
        setComments([...comments, createdComment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:max-w-sm mx-auto bg-white rounded-lg shadow-lg mb-6 sm:p-4 p-3">
      <img
        src={post.imageURL}
        alt="Post"
        className="w-full sm:w-90 h-74 object-cover rounded-lg shadow-md"
      />
      <div className="flex justify-between mt-4">
        <h4 className="font-semibold">{post.username}</h4>
        <div className="flex space-x-4">
          {/* Like Button */}
          <div
            className={`${isLiked && "text-red-500"} ${
              currentUserId ? "cursor-pointer" : "text-gray-500"
            }`}
            onClick={handleLike}
          >
            {isLiked ? LikedIcon() : NotLikedIcon()}
            <span className="ml-1">{likes.length}</span>
          </div>

          <div
            className={`${currentUserId ? "cursor-pointer" : "text-gray-500"}`}
            onClick={toggleComments}
          >
            {CommentIcon()}
          </div>

          <div
            className={`${currentUserId ? "cursor-pointer" : "text-gray-500"}`}
            onClick={handleSavePost}
          >
            {isSaved ? BookMarked() : NotBookMarked()}
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 h-64 overflow-y-auto">
          <div className="space-y-4 mx-2">
            {comments.map((comment) => (
              <CommentComponent
                key={comment.id}
                comment={comment}
                postId={post.id}
                onReply={(parentId, text) => {
                  //setNewComment(text);
                  handleAddComment(parentId, text);
                }}
              />
            ))}
          </div>

          <div className="mt-4 flex space-x-2 mx-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={() => handleAddComment()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
