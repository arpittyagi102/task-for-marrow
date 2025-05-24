import Image from "next/image";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"
import { USERS } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation"

export default function Header({ user, setUser }: HeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    function handleChangeUser(selectedUser: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('user', selectedUser);
        router.push(`?${params.toString()}`);
    }

    return (
        <header className="w-full px-10 py-4 bg-neutral-900 text-white flex items-center justify-between">
            <h1 className="text-2xl font-bold">To Do List</h1>

            <div className="flex items-center gap-4">
                {/* Export Button */}
                <button className="bg-neutral-800 text-sm px-4 py-2 rounded-md flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-input-icon lucide-folder-input"><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" /><path d="M2 13h10" /><path d="m9 16 3-3-3-3" /></svg>
                    Export
                </button>

                {/* User Select */}
                <Select onValueChange={handleChangeUser} defaultValue="All Users">
                    <SelectTrigger className="w-[180px] focus:outline-none bg-neutral-800">
                        <SelectValue placeholder="All Users" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="All Users">All Users</SelectItem>
                        {USERS.map((user, index) => 
                            <SelectItem key={index} value={user}>{user}</SelectItem> 
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="right flex items-center gap-4">
                <h1>{user}</h1>
                <Image className="rounded-full" src='/placeholder-avatar.png' alt='avatar' width={32} height={32} />
            </div>
        </header>
    );
}

interface HeaderProps {
    user: string;
    setUser: (user: string) => void;
}



