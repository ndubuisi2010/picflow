"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalType =
  | "confirm"
  | "delete"
  | "alert"
  | "success"
  | "error"
  | "warning";

interface AppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: ModalType;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm?: () => void;
}

const typeConfig: Record<ModalType, {
  icon: React.ReactNode;
  iconBg: string;
  confirmVariant: "default" | "destructive" | "outline";
}> = {
  confirm: {
    icon: <Info className="h-6 w-6 text-blue-600" />,
    iconBg: "bg-blue-100",
    confirmVariant: "default",
  },
  delete: {
    icon: <Trash2 className="h-6 w-6 text-red-600" />,
    iconBg: "bg-red-100",
    confirmVariant: "destructive",
  },
  alert: {
    icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
    iconBg: "bg-yellow-100",
    confirmVariant: "outline",
  },
  success: {
    icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
    iconBg: "bg-green-100",
    confirmVariant: "default",
  },
  error: {
    icon: <XCircle className="h-6 w-6 text-red-600" />,
    iconBg: "bg-red-100",
    confirmVariant: "destructive",
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
    iconBg: "bg-orange-100",
    confirmVariant: "outline",
  },
};

export function AppModal({
  open,
  onOpenChange,
  title,
  description,
  type = "confirm",
  children,
  confirmText = "Continue",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
}: AppModalProps) {
  const config = typeConfig[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                config.iconBg
              )}
            >
              {config.icon}
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {children && <div className="py-2">{children}</div>}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>

          {onConfirm && (
            <Button
              type="button"
              variant={config.confirmVariant}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Please wait..." : confirmText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
