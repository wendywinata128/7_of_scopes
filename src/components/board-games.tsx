import { BoardI, LastActivity, PlayerI } from "@/other/constant/constant";
import {
  ImClubs,
  ImDiamonds,
  ImHeart,
  ImSpades,
  ImUpload,
} from "react-icons/im";
import PrintCard from "./print-card";

export default function BoardGames({
  boardData,
  lastActivity,
  currPlayer,
}: {
  boardData: BoardI | null;
  lastActivity?: LastActivity;
  currPlayer: PlayerI;
}) {
  return (
    <div className="border rounded p-8 box-content flex items-center gap-8 shrink-0 z-50 bg-zinc-800">
      <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full py-2 px-4 bg-white text-zinc-800 rounded-t text-xs font-bold">
        7 Of Spades
      </p>
      <div
        className="h-44 w-28 border rounded border-dashed border-white flex items-center justify-center text-xl text-white"
        id={`print-board-spade`}
      >
        <ImSpades />
        <PrintCard
          cards={boardData?.spade ?? []}
          id="spade"
          lastActivity={lastActivity}
          currPlayer={currPlayer}
        />
      </div>
      <div
        className="h-44 w-28 border rounded border-dashed border-red-400 flex items-center justify-center text-xl text-red-400 relative"
        id={`print-board-diamond`}
      >
        <ImDiamonds />
        <PrintCard
          cards={boardData?.diamond ?? []}
          id="diamond"
          lastActivity={lastActivity}
          currPlayer={currPlayer}
        />
      </div>
      <div
        className="h-44 w-28 border rounded border-dashed border-white flex items-center justify-center text-xl text-white"
        id={`print-board-club`}
      >
        <ImClubs />
        <PrintCard
          cards={boardData?.club ?? []}
          id="club"
          lastActivity={lastActivity}
          currPlayer={currPlayer}
        />
      </div>
      <div
        className="h-44 w-28 border rounded border-dashed border-red-400 flex items-center justify-center text-xl text-red-400"
        id={`print-board-heart`}
      >
        <ImHeart />
        <PrintCard
          cards={boardData?.heart ?? []}
          id="heart"
          lastActivity={lastActivity}
          currPlayer={currPlayer}
        />
      </div>
    </div>
  );
}
