import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { ImClubs, ImDiamonds, ImHeart, ImSpades } from "react-icons/im";
import CardClubs02 from '@/assets/card_clubs_02.png';

export default function PagePlay() {
    return <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
        <div className="border rounded p-8 box-content flex items-center gap-8 relative">
            <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full py-2 px-4 bg-white text-zinc-800 rounded-t text-xs font-bold">Board Games</p>
            <div className="h-44 w-28 border rounded border-dashed border-black flex items-center justify-center text-xl text-black">
                <ImSpades />
            </div>
            <div className="h-44 w-28 border rounded border-dashed border-red-400 flex items-center justify-center text-xl text-red-400">
                <ImDiamonds />
            </div>
            <div className="h-44 w-28 border rounded border-dashed border-black flex items-center justify-center text-xl text-black">
                <ImClubs />
            </div>
            <div className="h-44 w-28 border rounded border-dashed border-red-400 flex items-center justify-center text-xl text-red-400">
                <ImHeart />
            </div>
        </div>
    </div>
}