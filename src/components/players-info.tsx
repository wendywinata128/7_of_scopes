import { LastActivity, PlayerI } from "@/other/constant/constant";
import { ImSpades } from "react-icons/im";
import CardItem from "./card-item";
import { useEffect, useRef, useState } from "react";
import { delayTime } from "@/other/constant/global_function";

export default function PlayersInfo({
  playersData = [],
  currPlayer,
  lastActivity,
}: {
  playersData: PlayerI[];
  currPlayer: PlayerI;
  lastActivity?: LastActivity | null;
}) {
  const [animateActivity, setAnimateActivity] = useState({
    isFlip: true,
    scaleNormal: false,
    width: 60,
    height: 90,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function animate() {
      const boardData = document.querySelector(
        `#print-board-${lastActivity!.cardData.type}`
      );

      if (
        ref.current &&
        boardData &&
        lastActivity &&
        currPlayer.id !== lastActivity?.playerId
      ) {
        await delayTime(500);
        setAnimateActivity({
          isFlip: lastActivity.cardData.status === "closed",
          scaleNormal: true,
          width: boardData.clientWidth,
          height: boardData.clientHeight,
        });
        await delayTime(1000);
        if (lastActivity.cardData.status !== "closed") {
          let [x, y] = [
            boardData.getBoundingClientRect().x -
              ref.current.getBoundingClientRect().x -
              ref.current.clientWidth,
            boardData.getBoundingClientRect().y -
              ref.current.getBoundingClientRect().y -
              ref.current.clientHeight / 2,
          ];

          if (lastActivity.cardData.value < 7) {
            y += 96;
          } else if (lastActivity.cardData.value > 7) {
            y -= 96;
          }

          ref.current.style.zIndex = "102";
          ref.current.style.transitionDuration = "2s";
          ref.current.style.transform = ` translateX(${x}px) translateY(${y}px)`;

          await delayTime(2000);

          setAnimateActivity({
            isFlip: true,
            scaleNormal: false,
            width: 60,
            height: 90,
          });

          ref.current.style.zIndex = "";
          ref.current.style.transitionDuration = "";
          ref.current.style.transform = ``;
        } else {
          await delayTime(1000);
          setAnimateActivity((old) => ({
            ...old,
            isFlip: true,
            scaleNormal: false,
            // width: 60,
            // height: 90,
          }));
          await delayTime(1000);
          setAnimateActivity((old) => ({
            ...old,
            width: 60,
            height: 90,
          }));
        }
      }
    }

    animate();
  }, [lastActivity]);
  return (
    <div className="right-6 flex flex-col gap-4">
      {playersData
        .filter((p) => p.id != currPlayer.id)
        .map((player) => {
          return (
            <div key={player.name} className="border p-4 rounded relative">
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

              <div
                className={`absolute top-1/2 -translate-y-1/2 -left-4 -translate-x-full ${
                  !animateActivity.scaleNormal && "scale-0"
                } duration-1000 transition`}
                ref={ref}
              >
                <CardItem
                  character={lastActivity?.cardData.character ?? ""}
                  type={lastActivity?.cardData.type ?? "spade"}
                  width={animateActivity.width}
                  height={animateActivity.height}
                  isFlipped={animateActivity.isFlip}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
