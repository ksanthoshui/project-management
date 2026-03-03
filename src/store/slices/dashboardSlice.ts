import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.ts";

interface DashboardState {
  stats: any;
  distribution: any;
  weeklyActivity: any[];
  performance: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  distribution: null,
  weeklyActivity: [],
  performance: [],
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk("dashboard/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/dashboard/stats");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard stats");
  }
});

export const fetchTeamPerformance = createAsyncThunk("dashboard/fetchPerformance", async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/dashboard/performance/${projectId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch team performance");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.distribution = action.payload.distribution;
        state.weeklyActivity = action.payload.weeklyActivity;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeamPerformance.fulfilled, (state, action) => {
        state.performance = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
