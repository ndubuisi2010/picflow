// @/components/photo/photo-modal.tsx
import MyModal from "@/components/my-modal";
import { Button } from "@/components/ui/button";
import { Heart, Download } from "lucide-react";

export default function PhotoModal({
  open,
  photo,
  onClose,
  onLikeToggle,
}: {
  open: boolean;
  photo: any;
  onClose: () => void;
  onLikeToggle: (id: number) => void;
}) {
  if (!photo) return null;

  return (
    <MyModal open={open} onClose={onClose} title={photo.title}>
      <div className="space-y-4">
        <img
          src={photo.storage_path}
          alt={photo.title}
          className="w-full max-h-[60vh] object-contain rounded-lg"
        />

        <div className="flex gap-3">
          <Button
            onClick={() => onLikeToggle(photo.id)}
            className="flex-1"
          >
            <Heart className="mr-2 h-4 w-4" />
            {photo.likes_count}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              const link = document.createElement("a");
              link.href = photo.storage_path;
              link.download = photo.title;
              link.click();
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </MyModal>
  );
}
