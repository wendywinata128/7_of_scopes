import { LastActivity, PlayerI } from "@/other/constant/constant";
import { ImSpades } from "react-icons/im";
import CardItem from "./card-item";

export default function PlayersInfo({
  playersData = [],
  currPlayer,
  lastActivity,
}: {
  playersData: PlayerI[];
  currPlayer: PlayerI;
  lastActivity?: LastActivity;
}) {
  return (
    <div className="right-6 flex flex-col gap-4">
      {playersData
        .filter((p) => p.id != currPlayer.id)
        .map((player) => {
          if (player.id === lastActivity?.playerId) {
          }

          return (
            <div key={player.name} className="border p-4 rounded">
              <div className="flex justify-between text-sm mb-3 items-center">
                <p className="font-semibold capitalize">{player.name}</p>
                <p className="text-xs">
                  {player.cards.filter((p) => p.status === "open").length} Cards
                </p>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {player.cards.map((card) =>
                  card.status === "closed" ? (
                    <div
                      className="w-4 h-5 bg-black relative flex items-center justify-center"
                      key={`${card.character} - ${card.type}`}
                    >
                      {/* <div className="corak absolute h-5 w-[1px] rotate-12"></div> */}
                      <ImSpades className="text-[7px]" />
                    </div>
                  ) : (
                    <div
                      key={`${card.character} - ${card.type}`}
                      className="w-4 h-5 border-red-500 bg-red-500 relative flex items-center justify-center"
                    >
                      {/* <div className="corak absolute h-5 w-[1px] bg-white rotate-12"></div> */}
                      <ImSpades className="text-[7px]" />
                    </div>
                  )
                )}
              </div>

              {player.id === lastActivity?.playerId && (
                <CardItem
                  character={lastActivity?.cardData.character ?? ""}
                  type={lastActivity?.cardData.type ?? "spade"}
                  width={40}
                  height={60}
                />
              )}
            </div>
          );
        })}
    </div>
  );
}
