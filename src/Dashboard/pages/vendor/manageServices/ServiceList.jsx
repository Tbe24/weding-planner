import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import useVendorServices from "../../../../hooks/useVendorServices";

const SERVICE_CATEGORIES = ["Silver", "Gold", "Platinum"];

// Helper function to get package type color
const getCategoryColor = (packageType) => {
  if (!packageType) return "default";

  switch (packageType.toLowerCase()) {
    case "silver":
      return "secondary";
    case "gold":
      return "warning";
    case "platinum":
      return "primary";
    default:
      return "default";
  }
};

const ServiceList = () => {
  const {
    services,
    loading,
    error,
    fetchServices,
    addService,
    updateService,
    deleteService,
  } = useVendorServices();

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [newFeature, setNewFeature] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    packageType: "",
    features: [],
  });

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpen = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        price: service.price.toString(),
        packageType: service.packageType || "",
        features: service.features || [],
      });
    } else {
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        packageType: "",
        features: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingService) {
        await updateService(editingService.serviceId, serviceData);
        console.log("Service updated successfully");
      } else {
        await addService(serviceData);
        console.log("Service added successfully");
      }

      // Fetch the updated list of services
      await fetchServices();
      console.log("Services list refreshed");

      handleClose();
    } catch (err) {
      console.error("Failed to save service:", err);
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete.serviceId);
        console.log("Service deleted successfully");

        // Fetch the updated list of services
        await fetchServices();
        console.log("Services list refreshed after deletion");

        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      } catch (err) {
        console.error("Failed to delete service:", err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
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

      // If we're editing a service, update it immediately
      if (editingService) {
        const serviceData = {
          ...formData,
          features: updatedFeatures,
          price: parseFloat(formData.price),
        };
        updateService(editingService.serviceId, serviceData)
          .then(() => {
            console.log("Service updated with new feature");
            fetchServices(); // Refresh the list
          })
          .catch((err) => {
            console.error("Failed to update service with new feature:", err);
          });
      }
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

    // If we're editing a service, update it immediately
    if (editingService) {
      const serviceData = {
        ...formData,
        features: updatedFeatures,
        price: parseFloat(formData.price),
      };
      updateService(editingService.serviceId, serviceData)
        .then(() => {
          console.log("Service updated after removing feature");
          fetchServices(); // Refresh the list
        })
        .catch((err) => {
          console.error(
            "Failed to update service after removing feature:",
            err
          );
        });
    }
  };

  if (loading && !services.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" component="h1">
          Manage Services
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Service
        </Button>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.serviceId}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  <Chip
                    label={service.packageType || "Standard"}
                    color={getCategoryColor(service.packageType)}
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {service.description}
                </Typography>

                {service.features && service.features.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Features:
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {service.features.slice(0, 3).map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          color={
                            service.packageType?.toLowerCase() === "gold"
                              ? "warning"
                              : service.packageType?.toLowerCase() ===
                                "platinum"
                              ? "primary"
                              : service.packageType?.toLowerCase() === "silver"
                              ? "secondary"
                              : "default"
                          }
                          sx={{ m: 0.5 }}
                        />
                      ))}
                      {service.features.length > 3 && (
                        <Chip
                          label={`+${service.features.length - 3} more`}
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      )}
                    </Stack>
                  </Box>
                )}

                <Typography variant="h6" color="primary">
                  ETB {service.price.toLocaleString()}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpen(service)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(service)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Service Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingService ? "Edit Service" : "Add New Service"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingService ? "Update" : "Add"} Service
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the service "
            {serviceToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceList;
