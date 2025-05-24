import React, { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react";
import { USERS, TAGS, PRIORITIES } from "@/constants";

export default function TaskModal({ task, setTask, isOpen, setIsOpen }: TaskModalProps) {
    // UI states
    const [isTitleEditing, setIsTitleEditing] = useState(false);
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
    
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState(task.priority);
    const [tags, setTags] = useState(task.tags);
    const [assignee, setAssignee] = useState(task.assignee);
    const [dueDate, setDueDate] = useState(task.dueDate);

    const handleSave = () => {
        console.log({ title, description, priority, tags, dueDate, assignee });
        setTask({ ...task, title, description, priority, tags, dueDate, assignee });
        setIsOpen(false);
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
                        <Pencil className="hover:text-neutral-400 cursor-pointer"/>
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
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger className="bg-neutral-800 text-neutral-300 text-xs h-6 px-2 mb-4 rounded-md">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem key={-1} value={-1}>None</SelectItem>
                                    {PRIORITIES.map((priority, index) => (
                                        <SelectItem key={index} value={index}>{priority}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <p className="font-bold text-orange-300">Assignee</p>
                        <Select value={assignee} onValueChange={setAssignee}>
                            <SelectTrigger className="bg-neutral-800 text-neutral-300 text-xs h-6 px-2 mb-4 rounded-md">
                                <SelectValue placeholder="Tags" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem key={-1} value={-1}>None</SelectItem>
                                    {USERS.map((user, index) => (
                                        <SelectItem key={index} value={index}>{user}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <p className="font-bold text-orange-300">Tags</p>
                        <Select value={tags} onValueChange={setTags}>
                            <SelectTrigger className="bg-neutral-800 text-neutral-300 text-xs h-6 px-2 rounded-md">
                                <SelectValue placeholder="Tags" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem key={-1} value={-1}>None</SelectItem>
                                    {TAGS.map((tag, index) => (
                                        <SelectItem key={index} value={index}>{tag}</SelectItem>
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

interface Task {
    title: string;
    description: string;
    priority: number;
    tags: number;
    assignee: number;
    dueDate: Date;
}
interface TaskModalProps {
    task: Task;
    setTask: (task: Task) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}