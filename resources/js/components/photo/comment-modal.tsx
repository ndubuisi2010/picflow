// @/components/photo/comment-modal.tsx
import { useState } from "react";
import Modal from "@/components/my-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { router } from "@inertiajs/react";

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  photoId: number;
  comments: { id: number; content: string; user: { name: string } }[];
  onNewComment: (comment: string) => void;
}

export function CommentModal({ open, onClose, photoId, comments, onNewComment }: CommentModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    router.post(
      `/photos/${photoId}/comment`,
      { content },
      {
        onSuccess: () => {
          onNewComment(content);
          setContent("");
          onClose()
        },
        onFinish: () => setLoading(false),
      }
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-w-md mx-auto bg-background dark:bg-neutral-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <p className="font-semibold">{c?.user?.name}</p>
                <p className="text-sm text-muted-foreground">{c.content}</p>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
