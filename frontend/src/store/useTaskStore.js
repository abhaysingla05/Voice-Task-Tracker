import { create } from 'zustand';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';

const useTaskStore = create((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,
    filters: {
        status: '',
        priority: '',
        search: '',
    },

    setFilters: (newFilters) => {
        set((state) => ({ filters: { ...state.filters, ...newFilters } }));
        get().fetchTasks();
    },

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const tasks = await getTasks(filters);
            set({ tasks, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
            const newTask = await createTask(taskData);
            set((state) => ({ tasks: [newTask, ...state.tasks], isLoading: false }));
            return newTask;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateTask: async (id, taskData) => {
        // Optimistic update
        const previousTasks = get().tasks;
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t)),
        }));

        try {
            await updateTask(id, taskData);
        } catch (error) {
            // Revert on failure
            set({ tasks: previousTasks, error: error.message });
        }
    },

    deleteTask: async (id) => {
        const previousTasks = get().tasks;
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
        }));

        try {
            await deleteTask(id);
        } catch (error) {
            set({ tasks: previousTasks, error: error.message });
        }
    },
}));

export default useTaskStore;
