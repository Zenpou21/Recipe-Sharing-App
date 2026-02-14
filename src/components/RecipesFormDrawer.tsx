import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Form,
  Input,
  Textarea,
} from "@heroui/react";
import { Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Recipe, Ingredient } from "../hooks/useRecipes";
import FormSkeleton from "./FormSkeleton";

interface RecipesFormDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: "create" | "update";
  initialData?: Recipe;
  loading?: {
    one?: boolean;
    create?: boolean;
    update?: boolean;
  };
  onSubmit?: (data: Recipe) => void;
}

const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    quantity: "",
    unit: "",
  });
  const addIngredient = () => {
    if (!newIngredient.name.trim()) return;

    setIngredients((prev) => [
      ...prev,
      {
        ...newIngredient,
        name: newIngredient.name.trim(),
      },
    ]);
    setNewIngredient({ name: "", quantity: "", unit: "" });
  };

  const deleteIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateIngredientField = (field: keyof Ingredient, value: string) => {
    setNewIngredient((prev) => ({ ...prev, [field]: value }));
  };

  const resetIngredients = () => {
    setIngredients([]);
    setNewIngredient({ name: "", quantity: "", unit: "" });
  };

  return {
    ingredients,
    newIngredient,
    addIngredient,
    deleteIngredient,
    updateIngredientField,
    resetIngredients,
    setIngredients,
  };
};

export default function RecipesFormDrawer({
  isOpen,
  onOpenChange,
  type,
  initialData,
  loading,
  onSubmit,
}: RecipesFormDrawerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  const {
    ingredients,
    newIngredient,
    addIngredient,
    deleteIngredient,
    updateIngredientField,
    resetIngredients,
    setIngredients,
  } = useIngredients();

  const resetForm = () => {
    setTitle("");
    setInstructions("");
    resetIngredients();
  };

  useEffect(() => {
    if (initialData && type === "update") {
      setTitle(initialData.title ?? "");
      setInstructions(initialData.instructions ?? "");
      setIngredients(initialData.ingredients ?? []);
    } else if (type === "create" && isOpen) {
      resetForm();
    }
  }, [initialData, type, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const recipeData: Recipe = {
      title,
      instructions,
      ingredients,
    };
    if (onSubmit) {
      await onSubmit(recipeData);
    }
  };

  return (
    <Drawer hideCloseButton radius="sm" size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <Form ref={formRef} className="flex flex-col h-full" onSubmit={handleSubmit}>
            <DrawerHeader className="flex flex-col gap-1 font-medium">
              {type === "create" ? "Create Recipe" : "Update Recipe"}
            </DrawerHeader>

            <DrawerBody className="w-full">
              {loading?.one ? (
                <FormSkeleton />
              ) : (
                <div className="space-y-3">
                  <div>
                    <Input
                      radius="sm"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      isDisabled={loading?.create || loading?.update}
                    />
                  </div>

                  <div>
                    <Textarea
                      radius="sm"
                      placeholder="Instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      isDisabled={loading?.create || loading?.update}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Ingredients</label>

                    <div className="flex gap-2">
                      <Input
                        radius="sm"
                        placeholder="Name"
                        value={newIngredient.name}
                        onValueChange={(e) => updateIngredientField("name", e)}
                        className="flex-1"
                        isDisabled={loading?.create || loading?.update}
                      />
                      <Input
                        radius="sm"
                        placeholder="Quantity"
                        value={newIngredient.quantity}
                        onValueChange={(e) => updateIngredientField("quantity", e)}
                        className="w-24"
                        isDisabled={loading?.create || loading?.update}
                      />
                      <Input
                        radius="sm"
                        placeholder="Unit"
                        value={newIngredient.unit}
                        onValueChange={(e) => updateIngredientField("unit", e)}
                        className="w-24"
                        isDisabled={loading?.create || loading?.update}
                      />
                      <Button
                        isDisabled={!newIngredient.name.trim() || loading?.create || loading?.update}
                        radius="sm"
                        isIconOnly
                        color="primary"
                        onPress={addIngredient}
                        type="button"
                        startContent={<Plus size={16} />}
                      />
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border-b border-default-200">
                          <div>
                            <span className="text-sm">{ingredient.name}</span>
                            {ingredient.quantity && (
                              <div className="text-xs text-default-500">Quantity: {ingredient.quantity}</div>
                            )}
                            {ingredient.unit && <div className="text-xs text-default-500">Unit: {ingredient.unit}</div>}
                          </div>
                          <Button
                            radius="sm"
                            size="sm"
                            color="danger"
                            variant="light"
                            onPress={() => deleteIngredient(index)}
                            type="button"
                            isIconOnly
                            isDisabled={loading?.create || loading?.update}
                            startContent={<Trash size={16} />}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DrawerBody>

            <DrawerFooter>
              <Button radius="sm" color="default" className="border" variant="bordered" onPress={onClose}>
                Close
              </Button>
              <Button
                isLoading={loading?.create || loading?.update}
                radius="sm"
                color="primary"
                type="submit"
                isDisabled={!title || !instructions || ingredients.length === 0}
              >
                {type === "create" ? "Create" : "Update"}
              </Button>
            </DrawerFooter>
          </Form>
        )}
      </DrawerContent>
    </Drawer>
  );
}
