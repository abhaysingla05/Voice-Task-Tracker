import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import clsx from 'clsx';

const TaskColumn = ({ id, title, tasks, onEdit, onDelete }) => {
    return (
        <div className="flex flex-col bg-gray-50/50 rounded-xl min-w-[300px] w-full md:w-1/3 h-full max-h-full">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-gray-50/50 backdrop-blur-sm rounded-t-xl z-10">
                <h2 className="font-bold text-gray-700 flex items-center gap-2">
                    {title}
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </h2>
            </div>

            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={clsx(
                            "flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors",
                            snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                        )}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default TaskColumn;
