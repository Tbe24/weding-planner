import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";

// Import custom hook for client bookings
import useClientBookings from "../../../../hooks/useClientBookings";

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

const StatusChip = ({ status }) => {
  // Handle undefined or null status
  const safeStatus = status || "PENDING";

  const getStatusColor = (statusValue) => {
    // Ensure status is a string
    const statusStr = String(statusValue);

    switch (statusStr) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  return <Chip label={safeStatus} color={getStatusColor(safeStatus)} size="small" />;
};

const PackageChip = ({ category }) => {
  // Handle undefined, null, or non-string category
  if (!category) return null;

  // Handle object type categories (convert to string or extract name property)
  let categoryStr;
  if (typeof category === 'object') {
    // If it's an object, try to get the name property or convert to a simple string
    categoryStr = category.name || category.type || 'Other';
  } else {
    // Otherwise convert to string
    categoryStr = String(category);
  }

  const getPackageColor = (categoryText) => {
    // Ensure we're working with a string and convert to lowercase
    const type = String(categoryText).toLowerCase();

    switch (type) {
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
        return "#000000";
    }
  };

  return (
    <Typography
      style={{
        color: getPackageColor(categoryStr),
        fontWeight: "bold",
      }}
    >
      {categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1)}
    </Typography>
  );
};

const MyBookingsList = () => {
  // Use the custom hook to fetch and manage bookings
  const {
    bookings,
    pagination,
    loading,
    error,
    changePage,
    changeLimit,
    refetch,
  } = useClientBookings();

  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const handlePageChange = (event, page) => {
    changePage(page);
  };

  const handleLimitChange = (event) => {
    changeLimit(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    // Add more sophisticated filtering when backend supports it
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">My Bookings</Typography>
        <Box>
          <IconButton onClick={toggleFilters} color="primary" title="Filter">
            <FilterListIcon />
          </IconButton>
          <IconButton onClick={refetch} color="primary" title="Refresh">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {showFilters && (
        <Box mb={2} p={2} component={Paper} variant="outlined">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="limit-label">Items per page</InputLabel>
                <Select
                  labelId="limit-label"
                  value={pagination.limit}
                  label="Items per page"
                  onChange={handleLimitChange}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="textSecondary" p={3}>
                    No bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                // Create a safe booking object with default values for missing properties
                const safeBooking = {
                  id: booking?.id || 'unknown',
                  service: {
                    name: booking?.service?.name || 'Unknown Service',
                    // Handle category that might be an object or string
                    category: booking?.service?.category || 'Other',
                    price: booking?.service?.price || 0
                  },
                  vendor: {
                    businessName: booking?.vendor?.businessName || 'Unknown Vendor'
                  },
                  eventDate: booking?.eventDate,
                  location: booking?.location || 'Not specified',
                  status: booking?.status || 'PENDING'
                };

                // Log the booking data for debugging
                console.log('Booking data:', booking);

                return (
                  <TableRow key={safeBooking.id}>
                    <TableCell>{safeBooking.service.name}</TableCell>
                    <TableCell>{safeBooking.vendor.businessName}</TableCell>
                    <TableCell>
                      <PackageChip category={safeBooking.service.category} />
                    </TableCell>
                    <TableCell>{formatDate(safeBooking.eventDate)}</TableCell>
                    <TableCell>{safeBooking.location}</TableCell>
                    <TableCell>
                      ETB {safeBooking.service.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={safeBooking.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination.totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default MyBookingsList;
