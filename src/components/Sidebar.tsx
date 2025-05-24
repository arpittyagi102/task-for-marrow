import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function Sidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priority, setPriority] = useState<string>('');
    const [activeTags, setActiveTags] = useState<string[]>([]);

    const updateURL = (key: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString());

        if (values.length > 0) {
            params.set(key, values.join(','));
        } else {
            params.delete(key);
        }

        router.push(`?${params.toString()}`);
    };

    useEffect(() => {
        const priority = searchParams.get('priority');
        const tags = searchParams.get('tags');
        const assignedUsers = searchParams.get('assignedUsers');

        if (priority) setPriority(priority);
        if (tags) setActiveTags(tags.split(','));
    }, []);

    return (
        <aside className="w-72 h-full text-sm m-5 p-5 px-8 bg-neutral-900 rounded-md text-neutral-300">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl text-neutral-300 font-bold text-center">Filters</h3>
                <hr className="border-neutral-500 mb-1" />

                <div className="flex gap-1 flex-col">
                    <h4 className="text-lg text-neutral-300">Priority</h4>
                    {['low', 'medium', 'high'].map(p => (
                        <div key={p} className="flex items-center gap-2 pl-5">
                            <Checkbox
                                checked={p == priority}
                                onCheckedChange={(checked) => {
                                    // only one priority can be selected at a time
                                    if (checked) {
                                        setPriority(p);
                                        updateURL('priority', [p]);
                                    } else {
                                        setPriority('');
                                        updateURL('priority', []);
                                    }
                                }}
                            /> {p.charAt(0).toUpperCase() + p.slice(1)}
                        </div>
                    ))}
                    <hr className="border-neutral-500 mt-2 mb-1" />
                </div>

                <div className="flex gap-1 flex-col">
                    <h4 className="text-lg text-neutral-300">Tags</h4>
                    {["Design", "Frontend", "Backend", "Database", "Marketing"].map(tag => (
                        <div key={tag} className="flex items-center gap-2 pl-5">
                            <Checkbox
                                checked={activeTags.includes(tag)}
                                onCheckedChange={(checked) => {
                                    const newTags = checked
                                        ? [...activeTags, tag]
                                        : activeTags.filter(t => t !== tag);
                                    setActiveTags(newTags);
                                    updateURL('tags', newTags);
                                }}
                            /> {tag}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}