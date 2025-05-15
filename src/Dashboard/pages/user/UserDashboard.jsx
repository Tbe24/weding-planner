import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Avatar,
  CircularProgress,
  Chip,
  CardMedia,
  CardActions,
} from "@mui/material";

// Import custom hook for client dashboard data
import useClientDashboard from "../../../hooks/useClientDashboard";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import TaskIcon from "@mui/icons-material/Task";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptIcon from "@mui/icons-material/Receipt";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const MetricCard = styled(StyledCard)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(2),
  },
}));

// Get user name from session storage or use default
const getUserName = () => {
  try {
    const userData = JSON.parse(
      sessionStorage.getItem("userData") || localStorage.getItem("userData")
    );
    if (userData && userData.firstName) {
      return `${userData.firstName} ${userData.lastName || ""}`;
    }
    return " User";
  } catch (error) {
    console.error("Error parsing user data:", error);
    return " User";
  }
};

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(" User");

  // Use the custom hook to fetch dashboard data
  const { dashboardData, loading, error, refetch } = useClientDashboard();

  // Extract relevant data from the dashboard data
  const metrics = {
    totalSpent: {
      total: `ETB ${dashboardData.totalPaymentAmount.toLocaleString()}`,
      lastMonth:
        dashboardData.payments.length > 0
          ? `ETB ${dashboardData.payments[0].amount.toLocaleString()}`
          : "ETB 0",
    },
    activeBookings: {
      total:
        dashboardData.bookings.confirmed.count +
        dashboardData.bookings.pending.count,
      pending: dashboardData.bookings.pending.count,
    },
    upcomingEvents: {
      total:
        dashboardData.bookings.confirmed.count +
        dashboardData.bookings.pending.count,
      nextDate:
        dashboardData.bookings.pending.data.length > 0
          ? dashboardData.bookings.pending.data[0]?.eventDate ||
            dashboardData.bookings.confirmed.data.length > 0
            ? dashboardData.bookings.confirmed.data[0]?.eventDate
            : "No upcoming events"
          : "No upcoming events",
    },
  };

  const transactions = dashboardData.payments.map((payment) => ({
    id: payment.id,
    service: payment.service,
    amount: `ETB ${payment.amount.toLocaleString()}`,
    date: formatDate(payment.createdAt),
    status: payment.status,
    vendor: payment.vendor,
  }));

  // Combine pending and confirmed bookings for upcoming events
  const upcomingEvents = [
    ...dashboardData.bookings.confirmed.data.map((booking) => ({
      id: booking.id,
      title: booking.serviceName,
      date: booking.eventDate,
      vendor: booking.vendorName,
      location: booking.location,
      status: "Confirmed",
    })),
    ...dashboardData.bookings.pending.data.map((booking) => ({
      id: booking.id,
      title: booking.serviceName,
      date: booking.eventDate,
      vendor: booking.vendorName,
      location: booking.location,
      status: "Pending",
    })),
  ];

  // Load user name
  useEffect(() => {
    setUserName(getUserName());
  }, []);

  const HomeButton = () => {
    return (
      <Button
        variant="text"
        startIcon={<HomeIcon />}
        onClick={() => navigate("/")}
        sx={{ marginBottom: 2 }}
      >
        Home
      </Button>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <HomeButton />
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
    <Box p={3}>
      <HomeButton />

      <DashboardHeader>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {userName}
          </Typography>
        </Box>
      </DashboardHeader>

      {/* Metrics Grid */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={4}>
          <MetricCard>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary" gutterBottom>
                  Total Spent
                </Typography>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {metrics.totalSpent.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Most Recent: {metrics.totalSpent.lastMonth}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <MetricCard>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary" gutterBottom>
                  Active Bookings
                </Typography>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <BookOnlineIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {metrics.activeBookings.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metrics.activeBookings.pending} Pending Confirmation
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <MetricCard>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary" gutterBottom>
                  Upcoming Events
                </Typography>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <EventIcon />
                </Avatar>
              </Box>
              <Typography variant="h4" component="div">
                {metrics.upcomingEvents.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next Event:{" "}
                {typeof metrics.upcomingEvents.nextDate === "string"
                  ? metrics.upcomingEvents.nextDate
                  : formatDate(metrics.upcomingEvents.nextDate)}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Transaction History and Upcoming Events */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <StyledCard>
            <CardHeader
              title="Payment Transaction History"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ flexGrow: 1 }}>
              {transactions.length > 0 ? (
                <List>
                  {transactions.map((transaction) => (
                    <ListItem key={transaction.id} divider>
                      <ListItemIcon>
                        <ReceiptIcon
                          color={
                            transaction.status === "COMPLETED"
                              ? "success"
                              : "warning"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.service}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {transaction.vendor}
                            </Typography>
                            {` • ${transaction.date}`}
                          </React.Fragment>
                        }
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={transaction.status}
                          size="small"
                          color={
                            transaction.status === "COMPLETED"
                              ? "success"
                              : "warning"
                          }
                        />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {transaction.amount}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box p={3} textAlign="center">
                  <Typography variant="body1" color="text.secondary">
                    No payment transactions yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={5}>
          <StyledCard>
            <CardHeader
              title="Upcoming Events"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ flexGrow: 1 }}>
              {upcomingEvents.length > 0 ? (
                <List>
                  {upcomingEvents.map((event) => (
                    <ListItem key={event.id} divider>
                      <ListItemIcon>
                        <EventIcon
                          color={
                            event.status === "Confirmed" ? "success" : "warning"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {event.vendor}
                            </Typography>
                            {` • ${formatDate(event.date)}`}
                            <br />
                            {`Location: ${event.location || "Not specified"}`}
                          </React.Fragment>
                        }
                      />
                      <Chip
                        label={event.status}
                        size="small"
                        color={
                          event.status === "Confirmed" ? "success" : "warning"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box p={3} textAlign="center">
                  <Typography variant="body1" color="text.secondary">
                    No upcoming events
                  </Typography>
                </Box>
              )}
            </CardContent>
            <Box p={2} display="flex" justifyContent="center">
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/dashboard/my-bookings")}
                startIcon={<BookOnlineIcon />}
              >
                View All Bookings
              </Button>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
