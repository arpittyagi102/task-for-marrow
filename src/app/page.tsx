'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input"
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/Sidebar";
import { FiDelete } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { SiOpenvpn } from "react-icons/si";
import TaskModal from "@/components/TaskModal";

export default function Home() {
    // Active User
    const [user, setUser] = useState<string>("All Users");

    // Tags
    const [tags, setTags] = useState<string[]>([]);
    const [assignees, setAssignees] = useState<string[]>([]);

    // Filters
    const [search, setSearch] = useState<string>('');
    const [priority, setPriority] = useState<[boolean,boolean,boolean]>([false, false, false]);
    const [activeTags, setActiveTags] = useState<string[]>([]);

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
                        <button className="bg-orange-500 text-white px-4 py-1 rounded-md border-2 border-transparent hover:border-orange-600 hover:bg-transparent transition duration-200">
                            Add Task
                        </button>
                        <Input placeholder="Search For Tasks" className="w-60 px-4 py-2 bg-neutral-800 focus:bg-transparent"/>
                    </div>
                    <div>
                        <Task/>
                        <Task/>
                        <Task/>
                    </div>
                </section>
            </div>
            
            <TaskModal
                task={{
                    title: "Task Title",
                    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    priority: -1,
                    assignee: -1,
                    tags: -1,
                    dueDate: new Date(),
                }}
                setTask={() => {}}
                isOpen={true}
                setIsOpen={() => {}}
            />
        </main>
    );
}

function Task() {
    return (
        <div className="bg-neutral-800 p-4 mb-2 rounded-md">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <input type="checkbox" className="w-5 h-5 accent-orange-500"/>
                    <h3 className="text-lg text-neutral-300">Task Title</h3>
                </div>
                <p className="text-sm text-neutral-400 flex items-center gap-2">
                    <SiOpenvpn/>
                    <BiPencil/>
                    <FiDelete/>
                </p>
            </div>

            <div className="flex items-center gap-4 ml-4">
                <Badge>@arpittyagi102</Badge>
                <Badge variant='destructive'>Marketing</Badge>
            </div>
        </div>
    );
}
