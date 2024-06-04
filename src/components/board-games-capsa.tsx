import {
  BoardCapsaI,
  BoardI,
  LastActivity,
  LastActivityCapsa,
  PlayerI,
} from "@/other/constant/constant";
import {
  ImClubs,
  ImDiamonds,
  ImHeart,
  ImSpades,
  ImUpload,
} from "react-icons/im";
import PrintCard from "./print-card";
import CardItem from "./card-item";

export default function BoardGamesCapsa({
  boardData,
  lastActivity,
  currPlayer,
}: {
  boardData?: BoardCapsaI | null;
  lastActivity?: LastActivityCapsa;
  currPlayer: PlayerI;
}) {
  return (
    <div className="w-[700px] h-[250px] shrink-0 relative" id="board-games-capsa">
      <div className="absolute top-1 left-1 bottom-1 right-1 origin-left bg-transparent overflow-hidden translate-x-0 z-[300] flex items-center justify-center flex-col gap-2 pointer-events-none">
        <div className="absolute left-0 bottom-0 right-0 top-0 board-card flex gap-2 flex-col items-center justify-center translate-x-full select-none transition duration-1000 bg-zinc-800 w-full h-full pointer-events-auto">
          <p className="font-bold text-xl">Board Closed</p>
          <p className="text-sm">
            Player Turn : <b>playerTurn</b>
          </p>
        </div>
      </div>
      <div
        className="border rounded relative flex items-center shrink-0 z-50 bg-zinc-800 w-full h-full"
      >
        <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full py-2 px-4 bg-white text-zinc-800 rounded-t text-xs font-bold">
          {lastActivity?.cardData?.name ?? "Capsa Banting"}
        </p>

        <div className="flex items-center border w-full h-full overflow-hidden">
          {boardData &&
            boardData
              .filter(
                (board) =>
                  lastActivity?.playerId === currPlayer.id ||
                  board.highestCard.character !=
                    lastActivity?.cardData?.highestCard.character ||
                  board.highestCard.type !=
                    lastActivity?.cardData?.highestCard.type
              )
              .map((data, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex left-0 right-0 justify-center items-center absolute gap-[10px]"
                    style={
                      {
                        // paddingLeft: `${(data.cards.length - 1) * 10}px`,
                      }
                    }
                  >
                    {data.cards.map((c, indexCard) => (
                      <CardItem
                        key={`${c.character} - ${c.type}`}
                        character={c.character}
                        type={c.type}
                        width={110}
                        height={155}
                        className="drop-shadow-lg bg-red-500"
                        // isGrayBg={true}
                        // containerStyle={{
                        //   transform: `rotateY(7deg)`,
                        // }}
                        // className="flip rotate-y-2 animate-flip"
                        // containerClassName="animate-flip"
                      />
                    ))}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
