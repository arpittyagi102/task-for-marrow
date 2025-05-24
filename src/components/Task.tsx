import React from 'react';
import { Pencil, Trash2 } from "lucide-react";
import { type Todo } from "@/types";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/lib/toast";

export default function Task({ todo, fetchData, editTask, setTodos }: TaskProps) {

    async function handleDelete() {
        const response = await fetch(`/api/todos/${todo._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.ok) {
            fetchData();
            showToast('Task deleted successfully', 'success');
        } else {
            showToast('Failed to delete task', 'error');
        }
    }

    async function updateStatus() {
        setTodos(prevTodos =>
            prevTodos.map(t => 
                t._id === todo._id ? {...t, completed: !t.completed} : t
            )
        )

        const response = await fetch(`/api/todos/${todo._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...todo, completed: !todo.completed }),
        });
        if (response.ok) {
            // fetchData();
            // showToast('Task status updated successfully', 'success');
        } else {
            console.log(await response.json());
            showToast('Failed to update task status', 'error');
        }
    }

    return (
        <div className="bg-neutral-800 p-4 mb-2 rounded-md">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <input type="checkbox" className="w-5 h-5 accent-orange-500" checked={todo.completed} onChange={updateStatus}/>
                    <h3 className="text-lg text-neutral-300">{todo.title}</h3>
                </div>
                <p className="text-sm text-neutral-400 flex items-center gap-4">
                    <Pencil className="cursor-pointer text-neutral-500 hover:text-orange-500" onClick={() => editTask(todo)}/>
                    <Trash2 className="cursor-pointer text-neutral-500 hover:text-red-500" onClick={handleDelete}/>
                </p>
            </div>

            <div className="flex items-center gap-4 ml-4">
                <Badge variant='secondary'>{todo.priority}</Badge>
                {todo.assignedUsers?.map((user, index) => (
                    <Badge key={index} variant='default'>{user}</Badge>
                ))}
                {todo.tags?.map((tag, index) => (
                    <Badge key={index} variant='destructive'>{tag}</Badge>
                ))}
            </div>
        </div>
    );
}

interface TaskProps {
    todo: Todo;
    fetchData: () => Promise<void>;
    setTodos: Dispatch<SetStateAction<Todo[]>>;
    editTask: (todo: Todo) => void;
}