import { useState, useEffect } from "react";
import { clientService } from "../services/api";

// Map category to an appropriate icon
const getCategoryIcon = (categoryName) => {
  const icons = {
    Photography: "📸",
    Catering: "🍽️",
    Venue: "🏰",
    Decoration: "🎊",
    Music: "🎵",
    Cake: "🎂",
    Dress: "👰",
    Suit: "�",
    Makeup: "💄",
    Transportation: "�",
    // Add more category to icon mappings as needed
  };
  return icons[categoryName] || "🎁";
};

const useServices = (limit = 6) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Use clientService to fetch categories
        const response = await clientService.getServiceCategories();

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          // Transform the data to match our component's expectations
          let formattedCategories = response.data.data.map((category) => ({
            id: category.id,
            icon: getCategoryIcon(category.name),
            title: category.name,
            description:
              category.description ||
              "Explore our selection of services in this category",
            // Use service count instead of price
            price: category._count?.services || 0,
            category: "Category",
            // Use category image or fallback
            image: category.image || `/image/category-default.jpg`,
          }));

          // Limit the number of categories if needed
          if (limit && formattedCategories.length > limit) {
            formattedCategories = formattedCategories.slice(0, limit);
          }

          setServices(formattedCategories);
        } else {
          console.log("No categories found, using fallback data");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit]);

  return { services, loading, error };
};

export default useServices;
