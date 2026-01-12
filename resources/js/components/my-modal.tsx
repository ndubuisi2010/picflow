"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export default function MyModal({
  open,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC key (React 19 friendly)
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-4xl rounded-t-2xl sm:rounded-2xl bg-white dark:bg-neutral-900 shadow-xl transform transition-all duration-300 ease-out
        translate-y-0 sm:scale-100 animate-in slide-in-from-bottom sm:slide-in-from-top"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            {title && (
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-md p-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
