'use client'
import Image from "next/image";
import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {
    const [user, setUser] = useState<number>(0);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Header user={user} setUser={setUser}/>
        
        </main>
    );
}
