import { BoardI } from "@/other/constant/constant";
import { ImClubs, ImDiamonds, ImHeart, ImSpades } from "react-icons/im";
import CardItem from "./card-item";
import PrintCard from "./print-card";

export default function BoardGames({ boardData }: { boardData: BoardI | null }) {
  return (
    <div className="border rounded p-8 box-content flex items-center gap-8 relative ">
      <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full py-2 px-4 bg-white text-zinc-800 rounded-t text-xs font-bold">
        7 Of Spades
      </p>
      <div className="h-44 w-28 border rounded border-dashed border-white flex items-center justify-center text-xl text-white">
        <ImSpades />
        <PrintCard cards={boardData?.spade ?? []} />
      </div>
      <div className="h-44 w-28 border rounded border-dashed border-red-400 flex items-center justify-center text-xl text-red-400 relative">
        <ImDiamonds />
        <PrintCard cards={boardData?.diamond ?? []} />
      </div>
      <div className="h-44 w-28 border rounded border-dashed border-white flex items-center justify-center text-xl text-white">
        <ImClubs />
        <PrintCard cards={boardData?.club ?? []} />
      </div>
      <div className="h-44 w-28 border rounded border-dashed border-red-400 flex items-center justify-center text-xl text-red-400">
        <ImHeart />
        <PrintCard cards={boardData?.heart ?? []} />
      </div>
    </div>
  );
}
