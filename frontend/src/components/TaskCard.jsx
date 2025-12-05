import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
};

const TaskCard = ({ task, index, onEdit, onDelete }) => {
    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={clsx(
                        "bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow group relative",
                        snapshot.isDragging && "shadow-xl rotate-2 ring-2 ring-blue-500 z-50"
                    )}
                    onClick={() => onEdit(task)}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 leading-tight pr-6">{task.title}</h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this task?')) onDelete(task.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1 opacity-0 group-hover:opacity-100"
                            title="Delete task"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                        <span className={clsx("text-xs px-2 py-1 rounded-full font-medium border", priorityColors[task.priority])}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>

                        {task.dueDate && (
                            <div className="flex items-center text-xs text-gray-500 ml-auto">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
