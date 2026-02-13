import { Button, Image, Modal, ModalBody, ModalContent, ModalFooter, Spinner } from "@heroui/react";
import type { Recipe } from "../hooks/useRecipes";
import FoodBanner from "../assets/images/recipe-banner.jpg";
interface RecipesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: Recipe;
  loading?: boolean;
}

export default function RecipesModal({ isOpen, onOpenChange, recipe, loading }: RecipesModalProps) {
  return (
    <Modal size="lg" radius="sm" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <Spinner size="md" color="primary" />
                </div>
              ) : (
                <div>
                  <div>
                    <Image src={FoodBanner} radius="sm" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="font-medium">{recipe?.title}</div>
                    <div className="text-xs text-default-500 text-justify">{recipe?.instructions}</div>
                    <div className="text-xs">Ingredients</div>
                    <ul className="list-disc list-inside text-xs text-default-500">
                      {recipe?.ingredients.map((ingredient, index) => (
                        <li key={index}>
                          {ingredient.quantity && `${ingredient.quantity} `}
                          {ingredient.unit && `${ingredient.unit} of `}
                          {ingredient.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button radius="sm" size="sm" color="default" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
