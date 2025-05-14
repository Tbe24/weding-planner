import React from "react";
import VendorListCustom from "./Vendor/VendorListCustom";
import VendorShow from "./Vendor/VendorShow";
import VendorEdit from "./Vendor/VendorEdit";

// Import other admin components
import { userList, userEdit, userShow } from "./user";
import { paymentList, paymentShow } from "./payment";
import { feedbackList, feedbackShow } from "./feedback";
// Import event planner components if they exist
// import { eventPlannerList, eventPlannerShow } from './EventPlanner';

// Admin resource configuration
export const adminResources = [
  {
    name: "vendors",
    options: { label: "Vendors" },
    list: VendorListCustom, // Use our custom component instead of the standard List
    show: VendorShow,
    edit: VendorEdit,
  },
  {
    name: "users",
    options: { label: "Users" },
    list: userList,
    show: userShow,
    edit: userEdit,
  },
  {
    name: "payments",
    options: { label: "Payments" },
    list: paymentList,
    show: paymentShow,
},
  {
    name: "feedbacks",
    options: { label: "Reviews & Feedback" },
    list: feedbackList,
    show: feedbackShow,
  },
  // Add more resources as needed
];

export default adminResources;
