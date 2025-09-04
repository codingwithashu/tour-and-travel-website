import React, { JSX, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const useConfirm = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setIsLoading(false);
      setPromise({ resolve });
    });

  const handleClose = () => {
    setIsLoading(false);
    setPromise(null);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Loading...</span>
              </div>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};
