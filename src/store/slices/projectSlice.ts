import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.ts";

interface ProjectState {
  projects: any[];
  currentProject: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk("projects/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/projects");
    console.log("Fetch Projects Response:", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
  }
});

export const fetchProjectById = createAsyncThunk("projects/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects/${id}`);
    console.log("Fetch Project By ID Response:", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch project");
  }
});

export const createProject = createAsyncThunk("projects/create", async (projectData: any, { rejectWithValue }) => {
  try {
    const response = await api.post("/projects", projectData);
    console.log("Create Project Response:", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create project");
  }
});

export const updateProject = createAsyncThunk("projects/update", async ({ id, data }: { id: string, data: any }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/projects/${id}`, data);
    console.log("Update Project Response:", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update project");
  }
});

export const deleteProject = createAsyncThunk("projects/delete", async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete project");
  }
});

export const joinProject = createAsyncThunk("projects/join", async (code: string, { rejectWithValue }) => {
  try {
    const response = await api.post("/projects/join", { code });
    console.log("Join Project Response:", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to join project");
  }
});

export const inviteMember = createAsyncThunk("projects/invite", async ({ projectId, email }: { projectId: string, email: string }, { rejectWithValue }) => {
  try {
    const response = await api.post("/projects/invite", { projectId, email });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to invite member");
  }
});

export const removeMember = createAsyncThunk("projects/removeMember", async ({ projectId, userId }: { projectId: string, userId: string }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/projects/${projectId}/remove-member`, { userId });
    console.log("Remove Member Response:", response.data);
    return { projectId, userId, members: response.data.members };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to remove member");
  }
});

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.projects[index] = action.payload;
        if (state.currentProject?._id === action.payload._id) state.currentProject = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p._id !== action.payload);
        if (state.currentProject?._id === action.payload) state.currentProject = null;
      })
      .addCase(joinProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
