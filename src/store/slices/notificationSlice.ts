import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.ts";

interface NotificationState {
  notifications: any[];
  loading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
};

export const fetchNotifications = createAsyncThunk("notifications/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/notifications");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
  }
});

export const markNotificationRead = createAsyncThunk("notifications/markRead", async (id: string, { rejectWithValue }) => {
  try {
    await api.put(`/notifications/${id}/read`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to mark notification as read");
  }
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n._id === action.payload);
        if (notification) {
          notification.read = true;
        }
      });
  },
});

export default notificationSlice.reducer;
