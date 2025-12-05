import React, { useEffect, useState } from 'react';
import useTaskStore from './store/useTaskStore';
import { parseVoiceInput } from './api/tasks';
import TaskBoard from './components/TaskBoard';
import VoiceInput from './components/VoiceInput';
import ReviewModal from './components/ReviewModal';
import { Layout, Plus } from 'lucide-react';

function App() {
    const { tasks, fetchTasks, addTask, updateTask, deleteTask, isLoading } = useTaskStore();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [parsedTask, setParsedTask] = useState(null);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleVoiceTranscript = async (transcript) => {
        setIsProcessingVoice(true);
        try {
            const data = await parseVoiceInput(transcript);
            setParsedTask({ ...data, transcript });
            setIsReviewOpen(true);
        } catch (error) {
            console.error("Failed to parse voice input", error);
            alert("Failed to parse voice input. Please try again.");
        } finally {
            setIsProcessingVoice(false);
        }
    };

    const handleSaveTask = async (taskData) => {
        try {
            if (parsedTask?.id) {
                await updateTask(parsedTask.id, taskData);
            } else {
                await addTask(taskData);
            }
            setIsReviewOpen(false);
            setParsedTask(null);
        } catch (error) {
            console.error("Failed to save task", error);
            alert("Failed to save task.");
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        const task = tasks.find(t => t.id.toString() === draggableId);

        if (task && task.status !== destination.droppableId) {
            updateTask(task.id, { status: destination.droppableId });
        }
    };

    const handleManualAdd = () => {
        setParsedTask({
            title: '',
            priority: 'medium',
            status: 'todo',
            dueDate: null
        });
        setIsReviewOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                VoiceTask
                            </h1>
                        </div>

                        <div className="flex-1 max-w-2xl flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    onChange={(e) => useTaskStore.getState().setFilters({ search: e.target.value })}
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>

                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                onChange={(e) => useTaskStore.getState().setFilters({ status: e.target.value })}
                            >
                                <option value="">All Status</option>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>

                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                onChange={(e) => useTaskStore.getState().setFilters({ priority: e.target.value })}
                            >
                                <option value="">All Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <button
                            onClick={handleManualAdd}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            New Task
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
                {isLoading && tasks.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <TaskBoard
                        tasks={tasks}
                        onDragEnd={handleDragEnd}
                        onEdit={(task) => {
                            setParsedTask(task);
                            setIsReviewOpen(true);
                        }}
                        onDelete={(id) => deleteTask(id)}
                    />
                )}
            </main>

            <div className="fixed bottom-8 right-8 z-30">
                <VoiceInput
                    onTranscript={handleVoiceTranscript}
                    isProcessing={isProcessingVoice}
                />
            </div>

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                initialData={parsedTask || {}}
                onSave={handleSaveTask}
            />
        </div>
    );
}

export default App;
