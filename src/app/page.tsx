'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

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
            <div className="flex-1 w-full px-4 py-4">
                <Sidebar 
                    priority={priority} 
                    setPriority={setPriority} 
                    activeTags={activeTags}
                    setActiveTags={setActiveTags}
                />
            </div>
        </main>
    );
}
