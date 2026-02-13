import { Button, Card, CardBody, Image, Input, useDisclosure } from "@heroui/react";
import { ChefHat, Edit, Eye, Heart, Plus, Search, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RecipesDrawer from "../../components/RecipesDrawer";
import { useRecipes } from "../../hooks/useRecipes";
import type { Recipe } from "../../hooks/useRecipes";
import Skeleton from "../../components/Skeleton";
import FoodBanner from "../../assets/images/recipe-banner.jpg";
import RecipesModal from "../../components/RecipesModal";
import ConfirmationModal from "../../components/ConfirmationModal";
export default function Recipes() {
  const { allRecipes, getRecipes, createRecipe, updateRecipe, deleteRecipe, loading } = useRecipes();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onOpenChange: onDrawerOpenChange,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onOpenChange: onViewModalOpenChange } = useDisclosure();
  const {
    isOpen: isConfirmationModalOpen,
    onOpen: onConfirmationModalOpen,
    onOpenChange: onConfirmationModalOpenChange,
    onClose: onCloseConfirmationModal,
  } = useDisclosure();

  const [drawerType, setDrawerType] = useState<"create" | "update">("create");
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const searchRequestId = useRef(0);
  const favoriteRequestMap = useRef<Map<number, number>>(new Map());

  const FAVORITES_STORAGE_KEY = "recipe-favorites";

  const fetchRecipes = async () => {
    try {
      const data = await allRecipes();
      setRecipeList(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
    loadFavoritesFromStorage();
  }, []);

  const loadFavoritesFromStorage = () => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const favoriteIds = JSON.parse(stored) as number[];
        setFavorites(new Set(favoriteIds));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const saveFavoritesToStorage = (favoriteSet: Set<number>) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteSet)));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  };

  useEffect(() => {
    const currentRequestId = ++searchRequestId.current;
    const timer = setTimeout(() => {
      if (currentRequestId === searchRequestId.current) {
        setDebouncedSearchQuery(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  const filteredRecipes = useMemo(() => {
    let filtered = recipeList;

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((recipe) =>
        recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(query)),
      );
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((recipe) => recipe.id && favorites.has(recipe.id));
    }

    return filtered;
  }, [recipeList, debouncedSearchQuery, favorites, showFavoritesOnly]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const isFavorite = useCallback((recipeId: number | undefined): boolean => {
    return recipeId ? favorites.has(recipeId) : false;
  }, [favorites]);

  const handleToggleFavorite = useCallback(
    async (recipeId: number) => {
      const requestId = (favoriteRequestMap.current.get(recipeId) || 0) + 1;
      favoriteRequestMap.current.set(recipeId, requestId);

      const newFavorites = new Set(favorites);
      favorites.has(recipeId) ? newFavorites.delete(recipeId) : newFavorites.add(recipeId);
      setFavorites(newFavorites);

      try {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 300));
        if (favoriteRequestMap.current.get(recipeId) === requestId) {
          saveFavoritesToStorage(newFavorites);
        }
      } catch (error) {
        setFavorites(favorites);
        console.error("Failed to update favorite:", error);
      }
    },
    [favorites],
  );

  const handleViewRecipe = async (id: number | undefined) => {
    onViewModalOpen();
    const response = await getRecipes(id!);
    setSelectedRecipe(response);
  };

  const handleCreateRecipe = () => {
    setDrawerType("create");
    onDrawerOpen();
  };

  const handleUpdateRecipe = async (id: number | undefined) => {
    setDrawerType("update");
    onDrawerOpen();
    const response = await getRecipes(id!);
    setSelectedRecipe(response);
  };

  const handleDeleteRecipe = (id: number | undefined) => {
    onConfirmationModalOpen();
    setSelectedRecipe({ id } as Recipe);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecipe?.id) return;

    try {
      await deleteRecipe(selectedRecipe.id);
      onCloseConfirmationModal();
      fetchRecipes();
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  };

  const handleSubmitRecipe = async (data: Recipe) => {
    try {
      if (drawerType === "create") {
        await createRecipe(data);
        onCloseDrawer();
        fetchRecipes();
      } else {
        if (selectedRecipe?.id) {
          await updateRecipe(selectedRecipe.id, data);
          onCloseDrawer();
          fetchRecipes();
        }
      }
    } catch (error) {
      console.error("Failed to submit recipe:", error);
    }
  };

  return (
    <div>
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <ChefHat className="mr-2" />
          Recipes
        </h1>
        <div className="flex items-center gap-x-2">
          <div>
            <Input
              radius="sm"
              placeholder="Search by Ingredients"
              startContent={<Search size={16} />}
              value={searchQuery}
              onValueChange={handleSearchChange}
              isClearable
              onClear={() => setSearchQuery("")}
            />
          </div>
          <div>
            <Button
              radius="sm"
              variant={showFavoritesOnly ? "solid" : "flat"}
              color="primary"
              onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
              startContent={<Heart size={16} fill={showFavoritesOnly ? "currentColor" : "none"} />}
            >
              Favorites
            </Button>
          </div>
          <div>
            <Button radius="sm" color="primary" startContent={<Plus size={16} />} onPress={handleCreateRecipe}>
              Create New Recipe
            </Button>
          </div>
        </div>
      </div>
      {loading.all ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        <div>
          {filteredRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Search size={48} className="text-default-300 mb-4" />
              <h3 className="text-lg font-medium mb-1">No recipes found</h3>
              <p className="text-default-400 text-xs">
                {searchQuery
                  ? `No recipes match "${searchQuery}"`
                  : showFavoritesOnly
                    ? "No favorite recipes yet"
                    : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-5 p-6">
              {filteredRecipes.map((item, index) => (
                <Card shadow="sm" key={index} className="w-full space-y-5" radius="sm">
                  <CardBody className="p-0">
                    <Image src={FoodBanner} radius="sm" />
                    <div className=" p-3">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-default-400 truncate">{item.instructions}</div>
                      <div className="flex justify-end items-center pt-2">
                        <Button
                          isIconOnly
                          radius="sm"
                          color="danger"
                          variant={"light"}
                          onPress={() => item.id && handleToggleFavorite(item.id)}
                          startContent={
                            <Heart size={16} fill={isFavorite(item.id) ? "currentColor" : "none"} />
                          }
                        />
                        <Button
                          isIconOnly
                          radius="sm"
                          color="primary"
                          variant="light"
                          onPress={() => handleViewRecipe(item.id)}
                          startContent={<Eye size={16} />}
                        />
                        <Button
                          isIconOnly
                          radius="sm"
                          color="warning"
                          variant="light"
                          onPress={() => handleUpdateRecipe(item.id)}
                          startContent={<Edit size={16} />}
                        />
                        <Button
                          isIconOnly
                          radius="sm"
                          color="default"
                          variant="light"
                          onPress={() => handleDeleteRecipe(item.id)}
                          startContent={<Trash size={16} />}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      <RecipesDrawer
        isOpen={isDrawerOpen}
        onOpenChange={onDrawerOpenChange}
        type={drawerType}
        initialData={drawerType === "update" ? selectedRecipe : undefined}
        loading={loading}
        onSubmit={handleSubmitRecipe}
      />
      <RecipesModal
        isOpen={isViewModalOpen}
        recipe={selectedRecipe}
        loading={loading.one}
        onOpenChange={onViewModalOpenChange}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onOpenChange={onConfirmationModalOpenChange}
        loading={loading.delete}
        onSubmit={handleConfirmDelete}
      />
    </div>
  );
}
