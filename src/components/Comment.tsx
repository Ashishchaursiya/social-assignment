import { useState } from "react";
import { addNestedComment } from "../firebase/firebase-functions";

const Comment = ({ comment, postId, parentId = null }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (replyText.trim() === "") return;

    try {
      await addNestedComment(
        postId,
        parentId || comment.id,
        replyText,
        "currentUserId"
      );
      setReplyText("");
      setShowReplyBox(false);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="comment">
      <p>
        {comment.text} - by {comment.userId}
      </p>
      <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>

      {showReplyBox && (
        <div>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button onClick={handleReply}>Submit</button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId}
              parentId={comment.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
