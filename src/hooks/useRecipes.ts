import { addToast } from "@heroui/react";
import axios from "axios";
import { useState } from "react";

export interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

export interface Recipe {
  id?: number;
  title: string;
  instructions: string;
  ingredients: Ingredient[];
}

const API_BASE_URL = "http://127.0.0.1:8005/api";
const LATENCY_MS = 1000;

const simulateLatency = () => {
  return new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
};

const handleApiError = (err: Error | any, defaultMessage: string) => {
  addToast({
    size: "sm",
    title: "Error",
    variant:"flat",
    radius: "sm",
    description: err?.response?.data?.message || err?.message || defaultMessage,
    color: "danger",
  });
};

const handleApiSuccess = (message: string, data?: any) => {
  addToast({
    size: "sm",
    title: "Success",
    variant:"flat",
    radius: "sm",
    description: message,
    color: "success",
  });
  return data;
};

export function useRecipes() {
  const [loading, setLoading] = useState({
    all: false,
    one: false,
    create: false,
    update: false,
    delete: false,
  });

  const allRecipes = async () => {
    setLoading(prev => ({ ...prev, all: true }));
    try {
      await simulateLatency();
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      return response.data;
    } catch (err: Error | any) {
      handleApiError(err, "Failed to fetch recipes");
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

    const getRecipes = async (id: number) => {
    setLoading(prev => ({ ...prev, one: true }));
    try {
      await simulateLatency();
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
      return response.data;
    } catch (err: Error | any) {
      handleApiError(err, "Failed to fetch recipes");
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, one: false }));
    }
  };


  const createRecipe = async (recipe: Recipe) => {
    setLoading(prev => ({ ...prev, create: true }));
    try {
      await simulateLatency();
      const response = await axios.post(`${API_BASE_URL}/recipes`, recipe);
      return handleApiSuccess(response.data.message || "Recipe created successfully", response.data);
    } catch (err: Error | any) {
      handleApiError(err, "Failed to create recipe");
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  };

  const updateRecipe = async (id: number, recipe: Recipe) => {
    setLoading(prev => ({ ...prev, update: true }));
    try {
      await simulateLatency();
      const response = await axios.put(`${API_BASE_URL}/recipes/${id}`, recipe);
      return handleApiSuccess(response.data.message || "Recipe updated successfully", response.data);
    } catch (err: Error | any) {
      handleApiError(err, "Failed to update recipe");
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  const deleteRecipe = async (id: number) => {
    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await simulateLatency();
      const response = await axios.delete(`${API_BASE_URL}/recipes/${id}`);
      return handleApiSuccess(response.data.message || "Recipe deleted successfully", response.data);
    } catch (err: Error | any) {
      handleApiError(err, "Failed to delete recipe");
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return {
    allRecipes,
    getRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    loading,
  };
}
