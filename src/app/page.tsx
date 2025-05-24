'use client'
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { type Todo } from "@/types";
import TaskModal from "@/components/TaskModal";
import { showToast } from "@/lib/toast";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import Task from "@/components/Task";

export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read query params
    const userParam = searchParams.get("user") || "All Users";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const searchParam = searchParams.get("search") || '';

    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Active User
    const [user, setUser] = useState<string>(userParam);

    // Filters
    const [search, setSearch] = useState<string>(searchParam);
    const [priority, setPriority] = useState<[boolean, boolean, boolean]>([false, false, false]);
    const [activeTags, setActiveTags] = useState<string[]>([]);

    // UI States
    const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
    const [activeTask, setActiveTask] = useState<Todo | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(pageParam);
    const [totalPages, setTotalPages] = useState<number>(1);

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
        setUser(userParam);
        setCurrentPage(pageParam);
        setSearch(searchParam);
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userParam, pageParam, searchParam, searchParams.toString()]);


    async function fetchData() {
        try {
            setLoading(true);

            // Use all current search params from the URL
            const params = searchParams.toString();

            const response = await fetch(`/api/todos?${params}`);
            if (!response.ok) {
                showToast("Unable to fetch Tasks", 'error');
                setTodos([]);
                setLoading(false);
                return;
            }
            const result = await response.json();
            setTodos(result.data);
            setTotalPages(result.pagination?.totalPages || 1);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    // Pagination handlers
    const goToPage = (page: number) => {
        router.push(`/?user=${encodeURIComponent(user)}&page=${page}`);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Header user={user} setUser={setUser} />
            <div className="flex-1 flex w-full p-4">
                <Sidebar />
                <section className="flex-1 p-5">
                    <div className="flex items-center justify-between mb-5">
                        <button className="bg-orange-500 text-white px-4 py-1 rounded-md border-2 border-transparent hover:border-orange-600 hover:bg-transparent transition duration-200"
                            onClick={createNewTask}
                        >
                            Add Task
                        </button>
                        <Input
                            placeholder="Search For Tasks"
                            className="w-60 px-4 py-2 bg-neutral-800 focus:bg-transparent"
                            value={search}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // @ts-ignore
                                    const newSearch = e.target?.value as string;
                                    setSearch(newSearch);
                                    const params = new URLSearchParams(searchParams.toString());
                                    if (newSearch) {
                                        params.set('search', newSearch);
                                    } else {
                                        params.delete('search');
                                    }
                                    params.set('page', '1'); // Reset to first page on search
                                    router.push(`?${params.toString()}`);
                                }
                            }}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            todos.map(todo => (
                                <Task key={todo._id?.toString()} todo={todo} fetchData={fetchData} editTask={editTask} setTodos={setTodos} />
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

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                if (currentPage > 1) goToPage(currentPage - 1);
                            }}
                            aria-disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, idx) => (
                        <PaginationItem key={idx}>
                            <PaginationLink
                                href="#"
                                isActive={currentPage === idx + 1}
                                onClick={e => {
                                    e.preventDefault();
                                    goToPage(idx + 1);
                                }}
                            >
                                {idx + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                if (currentPage < totalPages) goToPage(currentPage + 1);
                            }}
                            aria-disabled={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </main>
    );
}

