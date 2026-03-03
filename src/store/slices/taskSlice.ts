import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.ts";

interface TaskState {
  tasks: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasksByProject = createAsyncThunk("tasks/fetchByProject", async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks");
  }
});

export const createTask = createAsyncThunk("tasks/create", async (taskData: any, { rejectWithValue }) => {
  try {
    const response = await api.post("/tasks", taskData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create task");
  }
});

export const updateTaskStatus = createAsyncThunk("tasks/updateStatus", async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tasks/${id}`, { status });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update task");
  }
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete task");
  }
});

export const addComment = createAsyncThunk("tasks/addComment", async ({ id, text }: { id: string; text: string }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/tasks/${id}/comments`, { text });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add comment");
  }
});

export const addSubtask = createAsyncThunk("tasks/addSubtask", async ({ id, title }: { id: string; title: string }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/tasks/${id}/subtasks`, { title });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add subtask");
  }
});

export const toggleSubtask = createAsyncThunk("tasks/toggleSubtask", async ({ id, subtaskId }: { id: string; subtaskId: string }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tasks/${id}/subtasks/toggle`, { subtaskId });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to toggle subtask");
  }
});

export const uploadAttachment = createAsyncThunk("tasks/uploadAttachment", async ({ id, file }: { id: string; file: File }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/tasks/${id}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to upload attachment");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(addSubtask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(toggleSubtask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
