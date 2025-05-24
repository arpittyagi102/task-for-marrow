import { Checkbox } from "@/components/ui/checkbox"

export default function Sidebar({priority, setPriority, activeTags, setActiveTags} : SidebarProps) {

    return (
        <aside className="w-72 h-full text-sm m-5 p-5 px-8 bg-neutral-900 rounded-md text-neutral-300">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl text-neutral-300 font-bold text-center">Filters</h3>
                <hr className="border-neutral-500 mb-1"/>

                <div className="flex gap-1 flex-col">
                    <h4 className="text-lg text-neutral-300">Priority</h4>
                    <div className="flex items-center gap-2 pl-5"><Checkbox onCheckedChange={is => setPriority((prev:ThreeBoolean) => [!!is, prev[1], prev[2]])} checked={priority[0]}/> Low</div>
                    <div className="flex items-center gap-2 pl-5"><Checkbox onCheckedChange={is => setPriority((prev:ThreeBoolean) => [prev[0], !!is, prev[2]])} checked={priority[1]}/> Medium</div>
                    <div className="flex items-center gap-2 pl-5"><Checkbox onCheckedChange={is => setPriority((prev:ThreeBoolean) => [prev[0], prev[1], !!is])} checked={priority[2]}/> High</div>
                    <hr className="border-neutral-500 mt-2 mb-1"/>
                </div>

                <div className="flex gap-1 flex-col">
                    <h4 className="text-lg text-neutral-300">Tags</h4>
                    <div className="flex items-center gap-2 pl-5"><Checkbox/> Design</div>
                    <div className="flex items-center gap-2 pl-5"><Checkbox/> Frontend</div>
                    <div className="flex items-center gap-2 pl-5"><Checkbox/> Backend</div>
                    <div className="flex items-center gap-2 pl-5"><Checkbox/> Database</div>
                    <div className="flex items-center gap-2 pl-5"><Checkbox/> Marketing</div>
                </div>
            </div>
        </aside>
    );
}

type ThreeBoolean = [boolean, boolean, boolean]

interface SidebarProps {
    priority : ThreeBoolean,
    setPriority : (state: ThreeBoolean | ((prev: ThreeBoolean) => ThreeBoolean)) => void,
    activeTags : string[],
    setActiveTags : (state: string[]) => void,
}
