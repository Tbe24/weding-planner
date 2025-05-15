import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import useVendorBookings from "../../../../hooks/useVendorBookings";

const BookingList = () => {
  const navigate = useNavigate();
  const {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    confirmBooking,
    cancelBooking,
    completeBooking,
  } = useVendorBookings();

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");

  // Load bookings on component mount and when filters change
  useEffect(() => {
    const params = {
      page,
      limit,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    fetchBookings(params);
  }, [fetchBookings, statusFilter, page, limit]);

  const handleViewBooking = (bookingId) => {
    navigate(`/dashboard/bookings/${bookingId}/show`);
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await confirmBooking(bookingId);
      // Refresh the list
      fetchBookings({
        page,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking || !cancellationReason.trim()) return;

    try {
      await cancelBooking(selectedBooking.id, cancellationReason);
      // Refresh the list
      fetchBookings({
        page,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      // Close dialog
      setCancelDialogOpen(false);
      setSelectedBooking(null);
      setCancellationReason("");
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await completeBooking(bookingId);
      // Refresh the list
      fetchBookings({
        page,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
    } catch (err) {
      console.error("Error completing booking:", err);
    }
  };

  const handleStatusChange = (event, newValue) => {
    setStatusFilter(newValue);
    setPage(1); // Reset to first page when changing filters
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle limit change (items per page)
  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "PENDING":
        return <Chip label="Pending" color="warning" size="small" />;
      case "CONFIRMED":
        return <Chip label="Confirmed" color="primary" size="small" />;
      case "COMPLETED":
        return <Chip label="Completed" color="success" size="small" />;
      case "CANCELLED":
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && !bookings.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => fetchBookings()}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" component="h1" gutterBottom>
        Manage Bookings
      </Typography>

      {/* Status Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={statusFilter}
          onChange={handleStatusChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Bookings" value="all" />
          <Tab label="Pending" value="PENDING" />
          <Tab label="Confirmed" value="CONFIRMED" />
          <Tab label="Completed" value="COMPLETED" />
          <Tab label="Cancelled" value="CANCELLED" />
        </Tabs>
      </Box>

      {/* Bookings Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id.substring(0, 8)}...</TableCell>
                  <TableCell>{booking.service.name}</TableCell>
                  <TableCell>
                    {booking.client.user.firstName}{" "}
                    {booking.client.user.lastName}
                  </TableCell>
                  <TableCell>{formatDate(booking.eventDate)}</TableCell>
                  <TableCell>
                    ETB {booking.service.price.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusChip(booking.status)}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewBooking(booking.id)}
                        title="View Details"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>

                      {booking.status === "PENDING" && (
                        <>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleConfirmBooking(booking.id)}
                            title="Confirm Booking"
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancelClick(booking)}
                            title="Cancel Booking"
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}

                      {booking.status === "CONFIRMED" && (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleCompleteBooking(booking.id)}
                          title="Mark as Completed"
                        >
                          <DoneIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" py={2}>
                    No bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination and Items Per Page */}
      {pagination.totalPages > 0 && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">Items per page:</Typography>
            <TextField
              select
              value={limit}
              onChange={handleLimitChange}
              size="small"
              sx={{ width: 80 }}
              SelectProps={{
                native: true,
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </TextField>
          </Box>

          {pagination.totalPages > 1 && (
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          )}
        </Stack>
      )}

      {/* Cancellation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for cancelling this booking. The client will
            be notified.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Cancellation Reason"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={!cancellationReason.trim()}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingList;
