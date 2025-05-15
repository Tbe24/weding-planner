import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/api.config";

const useServiceCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/client/service-categories`
        );

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          setCategories(response.data.data);
        } 
      } catch (err) {
        console.error("Error fetching service categories:", err);
        setError("Failed to load service categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useServiceCategories;
