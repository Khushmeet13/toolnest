import React, { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Smile,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from 'emoji-picker-react';

// Time formatter
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString();
};

// Emoji picker popup
const EmojiPopup = ({ show, position = "top-8 left-0", pickerRef, onSelect }) => {
  if (!show) return null;
  return (
    <div ref={pickerRef} className={`absolute ${position} z-30`}>
      <Picker
        data={data}
        onEmojiSelect={(emoji) => onSelect(emoji.native)}
        theme="light"
        previewPosition="none"
        skinTonePosition="none"
      />
    </div>
  );
};

// Login Modal
const LoginModal = ({ visible, refProp, onClose }) => {
  if (!visible) return null;
  return (
    <div className="relative">
      <div
        ref={refProp}
        className="absolute top-full left-[-35px] bg-white border rounded-lg p-4 w-80 shadow-lg z-50 flex flex-col items-center"
      >
        <h3 className="text-md font-semibold mb-2">Want to join the conversation?</h3>
        <p className="text-gray-600 mb-3 text-sm">Log in to continue</p>
        <button
          onClick={() => {
            onClose();
            window.open("https://example.com/login", "_blank", "noopener,noreferrer");
          }}
          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-600 w-full"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

// Edit Box
const EditBox = ({ text, setText, originalText, onSave, onCancel, onEmojiClick, showEmoji, emojiRef }) => (
  <div className="mt-2">
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows={1}
      className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-500 resize-none text-sm text-gray-800"
    />
    <div className="flex items-center justify-between relative">
      <button type="button" onClick={onEmojiClick} className="text-gray-500 hover:text-gray-700">
        <Smile size={20} />
      </button>
      <div className="flex gap-3 mt-2">
        <button onClick={onCancel} className="text-sm text-gray-600 hover:text-gray-800">
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!text.trim() || text.trim() === originalText.trim()}
          className={`text-sm font-medium rounded-full px-4 py-1 transition ${
            text.trim() && text.trim() !== originalText.trim()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>

      <EmojiPopup show={showEmoji} pickerRef={emojiRef} onSelect={(e) => setText((prev) => prev + e)} />
    </div>
  </div>
);

// Comment actions
const CommentActions = ({ commentId, likes, dislikes, onLike, onDislike, onReply, user }) => (
  <div className="flex gap-4 text-sm mt-2 text-gray-500">
    <button onClick={() => onLike(commentId)} className="flex gap-1">
      <ThumbsUp size={14} /> {likes.length}
    </button>
    <button onClick={() => onDislike(commentId)} className="flex gap-1">
      <ThumbsDown size={14} /> {dislikes.length}
    </button>
    <button onClick={onReply} className="flex gap-1">
      <Reply size={14} /> Reply
    </button>
  </div>
);

const CommentSection = () => {
  // MOCK USER
  const user = { _id: "123", name: "John Doe" };

  // MOCK COMMENTS
  const mockComments = [
    {
      _id: "c1",
      text: "This is a comment",
      likes: [],
      dislikes: [],
      createdAt: new Date().toISOString(),
      userId: { _id: "u1", name: "Alice" },
      replies: [
        {
          _id: "r1",
          text: "This is a reply",
          likes: [],
          dislikes: [],
          createdAt: new Date().toISOString(),
          userId: { _id: "u2", name: "Bob" },
        },
      ],
    },
  ];

  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [showCommentEmoji, setShowCommentEmoji] = useState(false);
  const [showReplyEmoji, setShowReplyEmoji] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReplyLoginModal, setShowReplyLoginModal] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  const commentEmojiRef = useRef(null);
  const replyEmojiRef = useRef(null);
  const loginModalRef = useRef(null);
  const menuRef = useRef(null);

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  // Dummy handlers
  const handleLike = (id) => console.log("Like", id);
  const handleDislike = (id) => console.log("Dislike", id);
  const handleDelete = (id) => console.log("Delete", id);
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { _id: Date.now().toString(), text: newComment, likes: [], dislikes: [], createdAt: new Date().toISOString(), userId: user, replies: [] }]);
    setNewComment("");
    setIsFocused(false);
  };
  const handleAddReply = (parentId) => {
    if (!replyText.trim()) return;
    setComments(
      comments.map((c) =>
        c._id === parentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                { _id: Date.now().toString(), text: replyText, likes: [], dislikes: [], createdAt: new Date().toISOString(), userId: user },
              ],
            }
          : c
      )
    );
    setReplyText("");
    setReplyTo(null);
  };
  const handleStartEdit = (item) => {
    setEditingId(item._id);
    setEditingText(item.text);
    setOriginalText(item.text);
  };
  const handleSaveEdit = () => {
    if (!editingText.trim() || editingText.trim() === originalText.trim()) return;
    setComments(comments.map((c) => (c._id === editingId ? { ...c, text: editingText } : c)));
    setEditingId(null);
    setEditingText("");
    setOriginalText("");
  };

  return (
    <div className="mx-auto">
      <h3 className="text-lg font-semibold mb-4">{comments.length} Comments</h3>

      {/* COMMENT INPUT */}
      <div className="flex items-start gap-3 mb-6">
        <div className={`rounded-full overflow-hidden ${isFocused ? "w-8 h-8" : "w-6 h-6"} bg-gray-200 flex items-center justify-center`}>
          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} className="rounded-full object-cover w-full h-full" />
        </div>

        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={1}
            className={`w-full bg-transparent border-b border-gray-300 focus:outline-none resize-none text-sm ${isFocused ? "border-gray-500" : "border-gray-300"}`}
          />
          {isFocused && (
            <div className="flex items-center justify-between mt-1 relative">
              <button onClick={() => setShowCommentEmoji((p) => !p)} className="text-gray-500 hover:text-gray-700">
                <Smile size={20} />
              </button>
              <div className="flex gap-3">
                <button onClick={() => setIsFocused(false)} className="text-sm text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`text-sm rounded-full px-4 py-1 ${newComment.trim() ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                >
                  Comment
                </button>
              </div>
              <EmojiPopup show={showCommentEmoji} pickerRef={commentEmojiRef} onSelect={(e) => setNewComment((prev) => prev + e)} />
            </div>
          )}
        </div>
      </div>

      <LoginModal visible={showLoginModal} refProp={loginModalRef} onClose={() => setShowLoginModal(false)} />

      {/* COMMENTS */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <img src={`https://ui-avatars.com/api/?name=${comment.userId.name}&background=random`} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium text-sm">
                  {comment.userId.name} <span className="text-gray-400">{formatTime(comment.createdAt)}</span>
                </p>
                <div className="relative">
                  <button onClick={() => setMenuOpenId(menuOpenId === comment._id ? null : comment._id)}>
                    <MoreVertical size={16} />
                  </button>
                  {menuOpenId === comment._id && (
                    <div ref={menuRef} className="absolute right-0 w-28 bg-white border rounded-md shadow-md z-50">
                      <button onClick={() => handleStartEdit(comment)} className="flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-gray-100">
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(comment._id)} className="flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-gray-100">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {editingId === comment._id ? (
                <EditBox
                  text={editingText}
                  setText={setEditingText}
                  originalText={originalText}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingId(null)}
                  onEmojiClick={() => setShowReplyEmoji(comment._id)}
                  showEmoji={showReplyEmoji === comment._id}
                  emojiRef={replyEmojiRef}
                />
              ) : (
                <p className="text-sm">{comment.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
