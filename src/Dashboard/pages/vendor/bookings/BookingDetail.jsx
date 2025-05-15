import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  EventNote as EventNoteIcon,
  ArrowBack as ArrowBackIcon,
  ChatBubble as ChatIcon,
  Send as SendIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import useVendorBookings from "../../../../hooks/useVendorBookings";
import { toast } from "react-toastify";
import { format } from "date-fns";

const BookingDetail = () => {
  // Extract booking ID from URL parameters
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract ID from URL path if not available in params
  const getBookingIdFromUrl = () => {
    // If bookingId is already available from useParams, use it
    if (bookingId) return bookingId;

    // Otherwise extract from the URL path
    const pathSegments = location.pathname.split('/');
    // Find the ID in the URL (assuming format like /dashboard/bookings/{id}/show)
    const idFromPath = pathSegments.find(segment =>
      segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    );

    return idFromPath;
  };

  const currentBookingId = getBookingIdFromUrl();

  const {
    currentBooking,
    loading,
    error,
    fetchBookingById,
    confirmBooking,
    cancelBooking,
    completeBooking,
  } = useVendorBookings();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  // Fetch booking details on component mount
  useEffect(() => {
    if (currentBookingId) {
      console.log(`Fetching booking details for ID: ${currentBookingId}`);
      fetchBookingById(currentBookingId);
    } else {
      console.error("No booking ID found in URL");
      toast.error("No booking ID found in URL");
    }
  }, [fetchBookingById, currentBookingId]);

  const handleConfirm = async () => {
    try {
      await confirmBooking(currentBookingId);
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
  };

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancellationReason.trim()) return;

    try {
      await cancelBooking(currentBookingId, cancellationReason);
      setCancelDialogOpen(false);
      setCancellationReason("");
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  };

  const handleComplete = async () => {
    try {
      await completeBooking(currentBookingId);
    } catch (err) {
      console.error("Error completing booking:", err);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "PENDING":
        return <Chip label="Pending" color="warning" />;
      case "CONFIRMED":
        return <Chip label="Confirmed" color="primary" />;
      case "COMPLETED":
        return <Chip label="Completed" color="success" />;
      case "CANCELLED":
        return <Chip label="Cancelled" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `ETB ${amount?.toLocaleString() || 0}`;
  };

  if (loading) {
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
          onClick={() => fetchBookingById(currentBookingId)}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (!currentBooking) {
    return (
      <Box p={3}>
        <Typography variant="h6">Booking not found</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/bookings")}
          sx={{ mt: 2 }}
        >
          Back to Bookings
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/bookings")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          Booking Details
        </Typography>
        <Box ml="auto" display="flex" alignItems="center" gap={2}>
          {getStatusChip(currentBooking.status)}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Service Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader title="Service Information" />
            <Divider />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {currentBooking.service.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {currentBooking.service.description}
              </Typography>
              <Box mt={2}>
                <Chip
                  label={`Category: ${currentBooking.service.category}`}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={`Price: ETB ${currentBooking.service.price.toLocaleString()}`}
                  color="primary"
                  size="small"
                  sx={{ mb: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Client Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader
              avatar={
                <Avatar
                  src={currentBooking.client.user.avatar}
                  alt={`${currentBooking.client.user.firstName} ${currentBooking.client.user.lastName}`}
                />
              }
              title="Client Information"
            />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${currentBooking.client.user.firstName} ${currentBooking.client.user.lastName}`}
                    secondary="Client Name"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={currentBooking.client.user.email}
                    secondary="Email"
                  />
                </ListItem>
                {currentBooking.client.user.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={currentBooking.client.user.phone}
                      secondary="Phone"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Details */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardHeader title="Booking Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1}
                      color="primary.main"
                    >
                      <EventIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Event Date</Typography>
                    </Box>
                    <Typography variant="body1">
                      {formatDate(currentBooking.eventDate)}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1}
                      color="primary.main"
                    >
                      <MoneyIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        Payment Status
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {currentBooking.payments &&
                      currentBooking.payments.length > 0
                        ? currentBooking.payments[0].status
                        : "No Payment"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1}
                      color="primary.main"
                    >
                      <LocationIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Location</Typography>
                    </Box>
                    <Typography variant="body1">
                      {currentBooking.location || "Not specified"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      mb={1}
                      color="primary.main"
                    >
                      <EventNoteIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Booking Date</Typography>
                    </Box>
                    <Typography variant="body1">
                      {formatDate(currentBooking.createdAt)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {currentBooking.specialRequests && (
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Special Requests:
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2}}
                  >
                    <Typography variant="body1" whiteSpace="pre-line">
                      {currentBooking.specialRequests}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Add Payment Details Section */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardHeader
              title="Payment Details"
              avatar={
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <ReceiptIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              {currentBooking.payments && currentBooking.payments.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Payment ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentBooking.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.id}</TableCell>
                          <TableCell>{formatDate(payment.createdAt)}</TableCell>
                          <TableCell>
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            {payment.paymentMethod || "N/A"}
                          </TableCell>
                          <TableCell>{getStatusChip(payment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box p={3} textAlign="center">
                  <Typography color="text.secondary">
                    No payment records found for this booking.
                  </Typography>
                </Box>
              )}

              {/* Payment Summary */}
              <Box mt={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        color="primary.main"
                      >
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          Total Amount
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {formatCurrency(currentBooking.service.price)}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        color="success.main"
                      >
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          Amount Received
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {formatCurrency(
                          currentBooking.payments
                            ?.filter((p) => p.status === "COMPLETED")
                            ?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
                        )}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        color="warning.main"
                      >
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          Amount Pending
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {formatCurrency(
                          currentBooking.payments
                            ?.filter((p) => p.status === "PENDING")
                            ?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
                        )}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        color={
                          currentBooking.payments &&
                          currentBooking.payments.some(
                            (p) => p.status === "COMPLETED"
                          )
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        <MoneyIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">
                          Payment Status
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {currentBooking.payments &&
                        currentBooking.payments.some(
                          (p) => p.status === "COMPLETED"
                        )
                          ? "Paid"
                          : "Unpaid"}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        {currentBooking.status === "PENDING" && (
          <>
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Confirm Booking
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancelClick}
            >
              Cancel Booking
            </Button>
          </>
        )}
        {currentBooking.status === "CONFIRMED" && (
          <Button variant="contained" color="success" onClick={handleComplete}>
            Mark as Completed
          </Button>
        )}
      </Box>

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

export default BookingDetail;
