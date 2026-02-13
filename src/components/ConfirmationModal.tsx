import { Button, Modal, ModalBody, ModalContent, ModalFooter } from "@heroui/react";
import { AlertTriangle } from "lucide-react";

interface RecipesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit?: () => void;
}

export default function ConfirmationModal({ isOpen, onOpenChange, loading, onSubmit }: RecipesModalProps) {
  return (
    <div>
      <Modal radius="sm" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="pt-9 flex flex-col items-center justify-center">
                    <AlertTriangle size={48} className="text-warning" />
                  <div className="font-medium">Are you sure you want to proceed?</div>
                  <div className="text-xs text-default-600">By confirming, this action cannot be undone.</div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button radius="sm" color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button radius="sm" color="primary" isLoading={loading} onPress={onSubmit}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
