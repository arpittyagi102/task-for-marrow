import React, { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react";
import { USERS, TAGS, PRIORITIES } from "@/constants";
import { type Todo } from "@/types";
import { showToast } from "@/lib/toast";

export default function TaskModal({ task, fetchData, isOpen, setIsOpen }: TaskModalProps) {
    // UI states
    const [isTitleEditing, setIsTitleEditing] = useState(false);
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState<"low" | "medium" | "high">(task.priority);
    const [tags, setTags] = useState<string[]>(task.tags || []);
    const [assignedUsers, setAssignedUsers] = useState<string[]>(task.assignedUsers || []);

    const handleSave = async () => {
        const todo = {
            ...task,
            title,
            description,
            priority,
            tags,
            assignedUsers,
            completed: task.completed || false,
            notes: task.notes || [],
            createdAt: task.createdAt || new Date(),
            updatedAt: new Date(),
        };

        let url = "/api/todos";
        let method = "POST";

        if(task._id) {
            url += `/${task._id}`;
            method = "PUT";
        }
        
        try {
            await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(todo),
            });
            fetchData();
            setIsOpen(false);
            showToast("Task saved successfully", "success");
        } catch (e) {
            alert("Failed to save task");
        }
    };

    return (
        <div className={`fixed inset-0 bg- z-50 flex items-center justify-center text-neutral-300 ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-neutral-900 p-6 w-2/3 border-dotted border-white border rounded-md shadow-lg">
                {/* Modal Header */}
                <div className="Modal-Header flex items-center justify-between mb-4">
                    {isTitleEditing ? (
                        <input
                            type="text"
                            className="text-2xl text-orange-200 font-semibold font-sans bg-transparent border-b border-neutral-50 focus:outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => setIsTitleEditing(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setIsTitleEditing(false);
                                }
                            }}
                        />
                    ) : (
                        <h1 className="text-2xl font-semibold font-sans">{title}</h1>
                    )}

                    <button className="flex gap-2" onClick={() => setIsTitleEditing(prev => !prev)}>
                        <Pencil className="hover:text-neutral-400 cursor-pointer" />
                    </button>
                </div>

                <div className="Modal-Body flex gap-4 rounded-md">
                    {isDescriptionEditing ? (
                        <textarea
                            className="w-3/4 text-wrap bg-transparent border-b text-orange-300 focus:outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => setIsDescriptionEditing(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    setIsDescriptionEditing(false);
                                }
                            }}
                        />
                    ) : (
                        <p className="w-3/4 text-wrap" onClick={() => setIsDescriptionEditing(true)}>
                            {description}
                        </p>
                    )}

                    <div className="border-l w-1/4 pl-4 flex flex-col gap-1">
                        <p className="font-bold text-orange-300">Priority</p>
                        <Select value={priority} onValueChange={val => setPriority(val as "low" | "medium" | "high")}>
                            <SelectTrigger className="bg-neutral-800 text-neutral-300 text-xs h-6 px-2 mb-4 rounded-md">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {PRIORITIES.map((priority) => (
                                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <p className="font-bold text-orange-300">Assignees</p>
                        <Select multiple value={assignedUsers} onValueChange={setAssignedUsers}>
                            <SelectTrigger className="bg-neutral-800 text-neutral-300 text-xs h-6 px-2 mb-4 rounded-md">
                                <SelectValue placeholder="Assignees" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {USERS.map((user) => (
                                        <SelectItem key={user} value={user}>{user}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <p className="font-bold text-orange-300">Tags</p>
                        <Select multiple value={tags} onValueChange={setTags}>
                            <SelectTrigger className="bg-neutral-800 text-neutral-300 text-xs h-6 px-2 rounded-md">
                                <SelectValue placeholder="Tags" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {TAGS.map((tag) => (
                                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="Modal-Footer flex items-center justify-end gap-4 mt-4">
                    <button className="hover:bg-orange-500 text-white px-4 py-1 rounded-md border-2 border-transparent border-orange-600 hover:bg-transparent transition duration-200" onClick={handleSave}>
                        Save
                    </button>
                    <button className="hover:bg-red-500 text-white px-4 py-1 rounded-md border-2 border-transparent border-red-600 hover:bg-transparent transition duration-200" onClick={() => setIsOpen(false)}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

interface Note {
    // Define your Note structure here
}

interface TaskModalProps {
    task: Todo;
    fetchData: () => Promise<void>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    notes?: Note[];
    setNotes: (notes: Note[] | ((notes: Note[]) => void)) => void;
}