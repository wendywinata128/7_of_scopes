import {
  CardI,
  LastActivity,
  LastActivityCapsa,
  PlayerI,
} from "@/other/constant/constant";
import { ImSpades } from "react-icons/im";
import CardItem from "./card-item";
import { useEffect, useRef, useState } from "react";
import {
  delayTime,
  getXAndYFromTransformProperty,
} from "@/other/constant/global_function";
import { animatePlayersInfoLastActivity } from "@/other/capsa";
// import { animatePlayersInfoLastActivity } from "@/other/capsa";

export default function PlayersInfoCapsa({
  playersData = [],
  currPlayer,
  lastActivity,
  currTurn,
  skippedPlayer,
}: {
  playersData: PlayerI[];
  currPlayer: PlayerI;
  currTurn: PlayerI;
  skippedPlayer: PlayerI[];
  lastActivity?: LastActivityCapsa | null;
}) {
  const [animateActivity, setAnimateActivity] = useState({
    isFlip: true,
    scaleNormal: false,
    width: 110,
    height: 155,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup = false;
    // return;
    let animating = animatePlayersInfoLastActivity(
      lastActivity,
      ref.current,
      currPlayer
    );

    return () => {
      animating.then((result) => {
        if (result) {
          result.forEach((clonedNode) => {
            if (clonedNode) {
              clonedNode.remove();
            }
          });

          // if(resizingFunction){
          //   window.removeEventListener("resize",  resizingFunction)
          // }
        }
      });
    };
  }, [lastActivity?.playerId]);
  return (
    <div className="right-6 flex flex-col gap-4">
      {playersData
        // .filter((p) => p.id != currPlayer.id)
        .map((player) => {
          const isSkipped = skippedPlayer.some((s) => s.id === player.id);
          return (
            <div
              key={player.id}
              className={`border p-4 rounded relative ${
                player.id === currTurn.id
                  ? "border-green-400"
                  : isSkipped
                  ? "border-black/50"
                  : ""
              }`}
            >
              {player.id === currPlayer.id && (
                <div className="text-[10px] text-red-400 font-semibold absolute top-[3px] left-1/2 -translate-x-1/2">
                  {" "}
                  (You)
                </div>
              )}
              {(player.cards ?? []).length === 0 ? (
                <div className="absolute left-0 top-0 right-0 bottom-0 bg-black/50 z-50 flex items-center justify-center font-bold">
                  WINNER
                </div>
              ) : isSkipped ? (
                <div className="absolute left-0 top-0 right-0 bottom-0 bg-black/50 z-50 flex items-center justify-center font-bold">
                  SKIPPED
                </div>
              ) : (
                <div></div>
              )}
              <div className="flex justify-between text-sm mb-3 gap-4 items-center">
                <p className="font-semibold capitalize max-w-28 overflow-hidden whitespace-nowrap text-ellipsis">
                  {player.name}
                </p>
                <p className="text-xs">
                  {
                    ([] as CardI[]).filter((p) => p.status === "open")
                      .length
                  }{" "}
                  Cards
                </p>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {([] as CardI[]).map((card) =>
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

              <div
                className={`absolute top-0 bottom-0 -left-4 -translate-x-full w-[110px] duration-1000 transition gap-2 z-[102]`}
                // key={`${lastActivity?.cardData.character} - ${lastActivity?.cardData.type}`}
              >
                {lastActivity?.playerId === player.id && (
                  <div ref={ref}>
                    {lastActivity?.cardData?.cards.map((card) => (
                      <CardItem
                        key={`${card.character} - ${card.type}`}
                        character={card.character ?? ""}
                        type={card.type ?? "spade"}
                        className={`card-item absolute top-1/2 -translate-y-1/2 ${
                          !animateActivity.scaleNormal && "scale-0"
                        } `}
                        width={animateActivity.width}
                        height={animateActivity.height}
                        isFlipped={animateActivity.isFlip}
                      />
                    )) ?? (
                      <div className="bg-blue-500 p-2 rounded transition duration-500 opacity-0 absolute">
                        Skipped!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
