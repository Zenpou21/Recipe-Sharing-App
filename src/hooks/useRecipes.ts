import { addToast } from "@heroui/react";
import axios from "axios";
import { useRef, useState } from "react";

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
  updated_at?: string;
}

const API_BASE_URL = "http://127.0.0.1:8005/api";
const LATENCY_MS = 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const isAbortError = (err: any): boolean => {
  return axios.isCancel(err) || err?.name === "AbortError" || err?.code === 20;
};

const simulateLatency = (signal?: AbortSignal) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, LATENCY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
};

const handleApiError = (err: Error | any) => {
  if (isAbortError(err)) {
    return;
  }
  addToast({
    size: "sm",
    title: "Error",
    variant: "flat",
    radius: "sm",
    description: err?.response?.data?.message ?? err?.message,
    color: "danger",
  });
};

const handleApiSuccess = (message: string, data?: any) => {
  addToast({
    size: "sm",
    title: "Success",
    variant: "flat",
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

  const abortControllers = useRef({
    create: null as AbortController | null,
    update: null as AbortController | null,
    delete: null as AbortController | null,
  });

  const retryWithBackoff = async (fn: () => Promise<any>, signal?: AbortSignal) => {
    let lastError;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        if (isAbortError(err) || signal?.aborted) throw err;
        if (attempt < MAX_RETRIES - 1) {
          const delay = RETRY_DELAY * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError;
  };

  const executeWithAbort = async (type: "create" | "update" | "delete", fn: (signal: AbortSignal) => Promise<any>) => {
    if (abortControllers.current[type]) {
      abortControllers.current[type]!.abort();
    }

    const controller = new AbortController();
    abortControllers.current[type] = controller;

    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const result = await retryWithBackoff(() => fn(controller.signal), controller.signal);
      return handleApiSuccess(result.data.message, result.data);
    } catch (err: any) {
      if (!isAbortError(err)) {
        handleApiError(err);
      }
      throw err;
    } finally {
      if (!controller.signal.aborted) {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
      abortControllers.current[type] = null;
    }
  };

  const allRecipes = async () => {
    setLoading((prev) => ({ ...prev, all: true }));
    try {
      await simulateLatency();
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      return response.data;
    } catch (err: Error | any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, all: false }));
    }
  };

  const getRecipes = async (id: number) => {
    setLoading((prev) => ({ ...prev, one: true }));
    try {
      await simulateLatency();
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
      return response.data;
    } catch (err: Error | any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, one: false }));
    }
  };

  const createRecipe = async (recipe: Recipe) => {
    return executeWithAbort("create", async (signal) => {
      await simulateLatency(signal);
      return await axios.post(`${API_BASE_URL}/recipes`, recipe, { signal });
    });
  };

  const updateRecipe = async (id: number, recipe: Recipe) => {
    return executeWithAbort("update", async (signal) => {
      await simulateLatency(signal);
      return await axios.put(`${API_BASE_URL}/recipes/${id}`, recipe, { signal });
    });
  };

  const deleteRecipe = async (id: number) => {
    return executeWithAbort("delete", async (signal) => {
      await simulateLatency(signal);
      return await axios.delete(`${API_BASE_URL}/recipes/${id}`, { signal });
    });
  };

  const cancelRequest = (type: "create" | "update" | "delete") => {
    abortControllers.current[type]?.abort();
    setLoading((prev) => ({ ...prev, [type]: false }));
  };

  return {
    allRecipes,
    getRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    cancelRequest,
    loading,
  };
}
