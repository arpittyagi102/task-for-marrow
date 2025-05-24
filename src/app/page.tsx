'use client'
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { type Todo } from "@/types";
import TaskModal from "@/components/TaskModal";
import { showToast } from "@/lib/toast";
import Task from "@/components/Task";

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Active User
    const [user, setUser] = useState<string>("All Users");

    // Filters
    const [search, setSearch] = useState<string>('');
    const [priority, setPriority] = useState<[boolean,boolean,boolean]>([false, false, false]);
    const [activeTags, setActiveTags] = useState<string[]>([]);

    // UI States
    const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
    const [activeTask, setActiveTask] = useState<Todo | null>(null);

    function createNewTask() {
        setActiveTask({
            title: '',
            description: '',
            priority: 'low',
            tags: [],
            assignedUsers: [],
            completed: false,
            notes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        setIsTaskModalOpen(true);
    }

    function editTask(todo: Todo) {
        setActiveTask(todo);
        setIsTaskModalOpen(true);
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const response = await fetch('/api/todos');
            const result = await response.json();
            setTodos(result.data);
            setLoading(false);   
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Header user={user} setUser={setUser}/>
            <div className="flex-1 flex w-full p-4">
                <Sidebar 
                    priority={priority} 
                    setPriority={setPriority} 
                    activeTags={activeTags}
                    setActiveTags={setActiveTags}
                />
                <section className="flex-1 p-5">
                    <div className="flex items-center justify-between mb-5">
                        <button className="bg-orange-500 text-white px-4 py-1 rounded-md border-2 border-transparent hover:border-orange-600 hover:bg-transparent transition duration-200"
                            onClick={createNewTask}
                        >
                            Add Task
                        </button>
                        <Input placeholder="Search For Tasks" className="w-60 px-4 py-2 bg-neutral-800 focus:bg-transparent"/>
                    </div>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            todos.map(todo => (
                                <Task key={todo._id?.toString()} todo={todo} fetchData={fetchData} editTask={editTask}/>
                            ))
                        )}
                    </div>
                </section>
            </div>
            
            {isTaskModalOpen && activeTask && (
                <TaskModal
                    isOpen={isTaskModalOpen}
                    setIsOpen={setIsTaskModalOpen}
                    task={activeTask}
                    fetchData={fetchData}
                />
            )}
        </main>
    );
}

