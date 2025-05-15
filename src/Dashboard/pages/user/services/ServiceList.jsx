import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  InputBase,
  Paper,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Rating,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EventIcon from "@mui/icons-material/Event";
import RefreshIcon from "@mui/icons-material/Refresh";
import SortIcon from "@mui/icons-material/Sort";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { clientService } from "../../../../services/api";

// Import custom hook for client services
import useClientServices from "../../../../hooks/useClientServices";

// Category chip component
const CategoryChip = ({ category }) => {
  // Handle undefined or null category
  if (!category) {
    return (
      <Chip
        label="Other"
        style={{
          backgroundColor: "#4caf50",
          color: "#fff",
        }}
        size="small"
      />
    );
  }

  // Get appropriate color for the category
  const getCategoryColor = (categoryText) => {
    // Ensure category is a string before calling toLowerCase
    const categoryLower = String(categoryText).toLowerCase();

    switch (categoryLower) {
      case "platinum":
        return "#1a237e"; // Dark blue
      case "gold":
      case "golden":
        return "#ff9800"; // Gold
      case "silver":
        return "#757575"; // Silver
      case "bronze":
        return "#cd7f32"; // Bronze
      default:
        return "#4caf50"; // Green for others
    }
  };

  const color = getCategoryColor(category);

  // Format category text for display
  const formatCategory = (text) => {
    // Ensure text is a string
    const textStr = String(text);
    return textStr.charAt(0).toUpperCase() + textStr.slice(1);
  };

  return (
    <Chip
      label={formatCategory(category)}
      style={{
        backgroundColor: color,
        color: "#fff",
      }}
      size="small"
    />
  );
};

// Service Card Component
const ServiceCard = ({ service, onBook }) => {
  // Handle missing data safely
  const safeService = {
    name: service?.name || "Unnamed Service",
    category: service?.category || "Other",
    description: service?.description || "No description available",
    price: service?.price || 0,
    vendor: {
      businessName: service?.vendor?.businessName || "Unknown Vendor",
      rating: service?.vendor?.rating || 0,
    },
    ...service // Keep all original properties
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.04)",
        }}
      >
        <PhotoCameraIcon sx={{ fontSize: 80, color: "rgba(0, 0, 0, 0.2)" }} />
      </CardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {safeService.name}
          </Typography>
          <CategoryChip category={safeService.category} />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ mb: 2 }}
        >
          {safeService.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            ETB {safeService.price.toLocaleString()}
          </Typography>
          <Box display="flex" alignItems="center">
            <Rating value={safeService.vendor.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" ml={0.5}>
              ({safeService.vendor.rating})
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" mt={1}>
          By {safeService.vendor.businessName}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={() => onBook(safeService)}
          startIcon={<EventIcon />}
        >
          Book Service
        </Button>
      </CardActions>
    </Card>
  );
};

// Booking Dialog Component
const BookingDialog = ({
  open,
  service,
  onClose,
  onConfirm,
  loading,
  paymentLoading,
}) => {
  const [bookingDate, setBookingDate] = useState(null);
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState(50);
  const [specialRequests, setSpecialRequests] = useState("");

  const handleConfirm = () => {
    if (!bookingDate) {
      return; // Validate date is selected
    }

    onConfirm({
      serviceId: service?.id,
      eventDate: bookingDate.toISOString(),
      location,
      attendees,
      specialRequests,
    });
  };

  // Combined loading state for booking and payment
  const isProcessing = loading || paymentLoading;
  const buttonText = paymentLoading
    ? "Processing Payment..."
    : loading
    ? "Processing Booking..."
    : "Confirm Booking";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book Service</DialogTitle>
      <DialogContent>
        <DialogContentText paragraph>
          You're booking <strong>{service?.name}</strong> provided by{" "}
          <strong>{service?.vendor?.businessName}</strong>.
        </DialogContentText>

        <DialogContentText color="primary.main" fontWeight="bold" paragraph>
          Price: ETB {service?.price?.toLocaleString() || 0}
        </DialogContentText>

        <DialogContentText variant="body2" color="text.secondary" paragraph>
          After booking, you will be redirected to our payment gateway to
          complete your payment.
        </DialogContentText>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Event Date *"
                value={bookingDate}
                onChange={(newDate) => setBookingDate(newDate)}
                format="PPP"
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    helperText: "Please select your event date",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location *"
              fullWidth
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              helperText="Enter the event location"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Number of Attendees"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              value={attendees}
              onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
              helperText="Estimated number of attendees"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Special Requests"
              fullWidth
              multiline
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              helperText="Any special requests or requirements"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!bookingDate || !location || isProcessing}
          startIcon={
            isProcessing && <CircularProgress size={20} color="inherit" />
          }
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main component
const ServiceList = () => {
  const navigate = useNavigate();
  const {
    services,
    pagination,
    loading,
    error,
    changePage,
    changeLimit,
    filterServices,
    searchServices,
    refetch,
  } = useClientServices();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price_asc");

  // Booking dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchServices(searchQuery);
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === "category") {
      setCategoryFilter(value);
      if (value !== "all") {
        filterServices({ category: value });
      } else {
        filterServices({ category: undefined });
      }
    } else if (filterName === "sort") {
      setSortBy(value);

      // Apply sorting parameters based on selection
      if (value === "price_asc") {
        filterServices({ sort: "price", order: "asc" });
      } else if (value === "price_desc") {
        filterServices({ sort: "price", order: "desc" });
      } else if (value === "rating_desc") {
        filterServices({ sort: "rating", order: "desc" });
      } else if (value === "newest") {
        filterServices({ sort: "createdAt", order: "desc" });
      }
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleOpenBookingDialog = (service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleCloseBookingDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmBooking = async (bookingData) => {
    setBookingLoading(true);
    try {
      // Create the booking using the API
      const response = await clientService.createBooking(bookingData);
      console.log("Booking response:", response);

      // Show success message
      toast.success("Service booked successfully!");
      setDialogOpen(false);

      // Get booking data from response
      const booking = response.data.booking;

      if (!booking || !booking.id) {
        throw new Error("Invalid booking response from server");
      }

      if (!booking.service || !booking.vendor) {
        console.warn("Booking response missing service or vendor data:", booking);
        // Try to supplement with selected service data
        booking.service = booking.service || {
          id: selectedService.id,
          price: selectedService.price,
          name: selectedService.name
        };
        booking.vendor = booking.vendor || {
          id: selectedService.vendor.id,
          businessName: selectedService.vendor.businessName
        };
      }

      // Initiate payment after successful booking
      await initiatePaymentForBooking(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(
        error.response?.data?.message || error.message ||
          "Failed to book service. Please try again."
      );
      setBookingLoading(false);
    }
  };

  // Handle payment initiation
  const initiatePaymentForBooking = async (booking) => {
    setPaymentLoading(true);
    try {
      console.log("Booking data for payment:", booking);

      // Get the current user ID from storage
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      let userId = null;

      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Prepare payment data with all required fields
      const paymentData = {
        amount: booking.service.price,
        vendorId: booking.vendor.id,
        bookingId: booking.id,
        userId: userId,
        currency: 'ETB',
        returnUrl: `${window.location.origin}/dashboard/my-bookings`
      };

      console.log("Payment data being sent:", paymentData);

      // Call payment initiation API
      const paymentResponse = await clientService.initiatePayment(paymentData);
      console.log("Payment response:", paymentResponse);

      // Get checkout URL from response
      const { checkoutUrl } = paymentResponse.data;

      if (!checkoutUrl) {
        throw new Error("No checkout URL returned from payment service");
      }

      // Show payment notification
      toast.info("Redirecting to payment page...");

      // Redirect to Chapa checkout page
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error(error.message || "Failed to process payment. Redirecting to bookings page.");

      // Redirect to bookings page if payment initiation fails
      setTimeout(() => {
        navigate("/dashboard/my-bookings");
      }, 1500);
    } finally {
      setBookingLoading(false);
      setPaymentLoading(false);
    }
  };

  if (loading && services.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" onClick={refetch}>
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header and Search */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Available Services
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse and book services for your events.
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mt={3}>
          {/* Search Bar */}
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: "auto", flexGrow: 1, maxWidth: "500px" },
            }}
            elevation={1}
            onSubmit={handleSearchSubmit}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>

          {/* Filter and Refresh Buttons */}
          <Box>
            <IconButton onClick={toggleFilters} color="primary" title="Filters">
              <FilterListIcon />
            </IconButton>
            <IconButton onClick={refetch} color="primary" title="Refresh">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Filter Section */}
        {showFilters && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="category-filter-label">Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="platinum">Platinum</MenuItem>
                    <MenuItem value="gold">Gold</MenuItem>
                    <MenuItem value="silver">Silver</MenuItem>
                    <MenuItem value="bronze">Bronze</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sort-by-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    startAdornment={<SortIcon color="action" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="price_asc">Price: Low to High</MenuItem>
                    <MenuItem value="price_desc">Price: High to Low</MenuItem>
                    <MenuItem value="rating_desc">Highest Rated</MenuItem>
                    <MenuItem value="newest">Newest First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Services Grid */}
      {services.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="h6" color="textSecondary">
            No services found matching your criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item key={service.id} xs={12} sm={6} md={4}>
              <ServiceCard service={service} onBook={handleOpenBookingDialog} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Box
            component="ul"
            sx={{
              display: "flex",
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {[...Array(pagination.totalPages)].map((_, index) => (
              <Box component="li" key={index} sx={{ mx: 0.5 }}>
                <Button
                  variant={
                    pagination.page === index + 1 ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => changePage(index + 1)}
                  sx={{ minWidth: 30 }}
                >
                  {index + 1}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Booking Dialog */}
      <BookingDialog
        open={dialogOpen}
        service={selectedService}
        onClose={handleCloseBookingDialog}
        onConfirm={handleConfirmBooking}
        loading={bookingLoading}
        paymentLoading={paymentLoading}
      />
    </Box>
  );
};

export default ServiceList;
