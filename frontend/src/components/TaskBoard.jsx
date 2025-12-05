import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskColumn from './TaskColumn';

const TaskBoard = ({ tasks, onDragEnd, onEdit, onDelete }) => {
    const columns = {
        todo: tasks.filter(t => t.status === 'todo'),
        'in-progress': tasks.filter(t => t.status === 'in-progress'),
        done: tasks.filter(t => t.status === 'done'),
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 h-full overflow-x-auto pb-4">
                <TaskColumn
                    id="todo"
                    title="To Do"
                    tasks={columns.todo}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
                <TaskColumn
                    id="in-progress"
                    title="In Progress"
                    tasks={columns['in-progress']}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
                <TaskColumn
                    id="done"
                    title="Done"
                    tasks={columns.done}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </DragDropContext>
    );
};

export default TaskBoard;
