import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useVendorServices from "../../../../hooks/useVendorServices";

const SERVICE_CATEGORIES = ["Silver", "Gold", "Platinum"];

const ServiceCreate = () => {
  const navigate = useNavigate();
  const { addService } = useVendorServices();
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    packageType: "",
    features: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
      };
      await addService(serviceData);
      navigate("/Mangeservices"); // Navigate back to service list
    } catch (err) {
      console.error("Failed to create service:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() !== "") {
      const updatedFeatures = [...formData.features, newFeature.trim()];
      console.log("Adding feature:", newFeature.trim());
      console.log("Updated features:", updatedFeatures);

      setFormData({
        ...formData,
        features: updatedFeatures,
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...formData.features];
    const removedFeature = updatedFeatures[index];
    updatedFeatures.splice(index, 1);

    console.log("Removing feature:", removedFeature);
    console.log("Updated features:", updatedFeatures);

    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h5" component="h1" gutterBottom>
        Add New Service now
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Price (ETB)"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Package Type"
              value={formData.packageType}
              onChange={(e) =>
                setFormData({ ...formData, packageType: e.target.value })
              }
              margin="normal"
              required
            >
              {SERVICE_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            {/* Features Section */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Service Features
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  label="Add Feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddFeature}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {formData.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    onDelete={() => handleRemoveFeature(index)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={() => navigate("/Mangeservices")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create Service"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServiceCreate;
