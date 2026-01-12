// @/components/photo/comment-drawer.tsx
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { router } from "@inertiajs/react";

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
  photoId: number;
  comments: { id: number; content: string; user: { name: string } }[];
  onNewComment: (comment: string) => void;
}

export function CommentDrawer({ open, onClose, photoId, comments, onNewComment }: CommentDrawerProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;
    setLoading(true);

    router.post(
      `/photos/${photoId}/comment`,
      { content },
      {
        onSuccess: () => {
          onNewComment(content);
          setContent("");
          onClose();
        },
        onFinish: () => setLoading(false),
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent position="right" size="sm" className="bg-background dark:bg-neutral-900 p-4 flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold mb-2">Comments</SheetTitle>
        </SheetHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3 items-start">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback>{c.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted dark:bg-neutral-800 rounded-lg p-2">
                  <p className="text-sm font-semibold">{c.user.name}</p>
                  <p className="text-sm text-muted-foreground">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <SheetFooter className="flex gap-2 mt-auto">
          <Input
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
