import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Plus } from "lucide-react";
import { USERS, TAGS, PRIORITIES } from "@/constants";
import { type Todo, type Note } from "@/types";
import { showToast } from "@/lib/toast";

export default function TaskModal({ task, fetchData, isOpen, setIsOpen }: TaskModalProps) {
    // UI states
    const [isTitleEditing, setIsTitleEditing] = useState(false);
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
    const [newNote, setNewNote] = useState("");

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState<"low" | "medium" | "high">(task.priority);
    const [tags, setTags] = useState<string[]>(task.tags || []);
    const [assignedUsers, setAssignedUsers] = useState<string[]>(task.assignedUsers || []);
    const [notes, setNotes] = useState<Note[]>(task.notes || []);

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

        if (task._id) {
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

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        try {
            const response = await fetch(`/api/todos/${task._id}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newNote.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to add note');
            }

            const result = await response.json();
            setNotes(result.data.notes);
            setNewNote("");
            showToast("Note added successfully", "success");
        } catch (error) {
            showToast("Failed to add note", "error");
        }
    };

    useEffect(() => {
        if (!task.title) {
            setIsTitleEditing(true);
        }
    }, [])

    return (
        <div className={`fixed inset-0 bg- z-50 flex items-center justify-center text-neutral-300 ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-neutral-900 p-6 w-2/3 border-dotted border-white border rounded-md shadow-lg">
                {/* Modal Header */}
                <div className="Modal-Header flex items-center justify-between mb-4">
                    {(isTitleEditing || !title) ? (
                        <input
                            type="text"
                            className="text-2xl text-orange-200 font-semibold font-sans bg-transparent border-b border-neutral-50 focus:outline-none"
                            value={title}
                            placeholder="Add Title"
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => setIsTitleEditing(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setIsTitleEditing(false);
                                }
                            }}
                        />
                    ) : (
                        <h1 className="text-2xl font-semibold font-sans" onClick={() => setIsTitleEditing(true)}>{title ?? 'Add Title'}</h1>
                    )}

                    <button className="flex gap-2" onClick={() => setIsTitleEditing(prev => !prev)}>
                        <Pencil className="hover:text-neutral-400 cursor-pointer" />
                    </button>
                </div>

                <div className="Modal-Body flex gap-4 rounded-md">
                    <div className="w-3/4 flex flex-col mt-auto">
                        {/* Description Section */}
                        {isDescriptionEditing ? (
                            <textarea
                                className="w-full text-wrap bg-transparent border-b text-orange-300 focus:outline-none"
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
                            <p className="w-full text-wrap" onClick={() => setIsDescriptionEditing(true)}>
                                {description}
                            </p>
                        )}

                        {/* Notes Section */}
                        <div className="mt-6">
                            <div className="space-y-2">
                                {notes.map((note) => (
                                    <div key={note._id?.toString()} className="bg-neutral-800 p-3 rounded-md">
                                        <p className="text-sm">{note.content}</p>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {new Date(note.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input
                                    className="w-full bg-neutral-800 text-neutral-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    placeholder="Add a note..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddNote();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleAddNote}
                                    className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

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
                        <Select
                            value=""
                            onValueChange={user => {
                                if (user && !assignedUsers.includes(user)) {
                                    setAssignedUsers([...assignedUsers, user]);
                                }
                            }}
                        >
                            <SelectTrigger className="bg-neutral-800 text-neutral-300 text-xs h-6 px-2 mb-2 rounded-md">
                                <SelectValue placeholder="Add Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {USERS.filter(user => !assignedUsers.includes(user)).map((user) => (
                                        <SelectItem key={user} value={user}>{user}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1 mb-4">
                            {assignedUsers.map(user => (
                                <span
                                    key={user}
                                    className="bg-orange-700 text-xs px-2 py-0.5 rounded flex items-center gap-1"
                                >
                                    {user}
                                    <button
                                        type="button"
                                        className="ml-1 text-white hover:text-red-400"
                                        onClick={() => setAssignedUsers(assignedUsers.filter(u => u !== user))}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        <p className="font-bold text-orange-300">Tags</p>
                        <Select
                            value=""
                            onValueChange={tag => {
                                if (tag && !tags.includes(tag)) {
                                    setTags([...tags, tag]);
                                }
                            }}
                        >
                            <SelectTrigger className="bg-neutral-800 text-neutral-300 text-xs h-6 px-2 rounded-md">
                                <SelectValue placeholder="Add Tag" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {TAGS.filter(tag => !tags.includes(tag)).map((tag) => (
                                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-orange-700 text-xs px-2 py-0.5 rounded flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        className="ml-1 text-white hover:text-red-400"
                                        onClick={() => setTags(tags.filter(t => t !== tag))}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
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

interface TaskModalProps {
    task: Todo;
    fetchData: () => Promise<void>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}