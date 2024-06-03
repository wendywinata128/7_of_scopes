import { LastActivity, PlayerI } from "@/other/constant/constant";
import { ImSpades } from "react-icons/im";
import CardItem from "./card-item";
import { useEffect, useRef, useState } from "react";
import {
  delayTime,
  getXAndYFromTransformProperty,
} from "@/other/constant/global_function";

export default function PlayersInfo({
  playersData = [],
  currPlayer,
  lastActivity,
  currTurn,
}: {
  playersData: PlayerI[];
  currPlayer: PlayerI;
  currTurn: PlayerI;
  lastActivity?: LastActivity | null;
}) {
  const [animateActivity, setAnimateActivity] = useState({
    isFlip: true,
    scaleNormal: false,
    width: 112,
    height: 176,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup = false;
    let animate = async () => {
      if (!lastActivity) return;

      const boardData = document.querySelector(
        `#print-board-${lastActivity!.cardData.type}`
      );
      if (
        ref.current &&
        boardData &&
        lastActivity &&
        currPlayer.id !== lastActivity?.playerId
      ) {
        let clonedNode: HTMLDivElement = ref.current.cloneNode(
          true
        ) as HTMLDivElement;
        
        clonedNode.classList.add(
          `cloned-${lastActivity.cardData.character}-${lastActivity.cardData.type}`
        );

        let clonedNodeContainer = clonedNode.querySelector(
          ".container"
        ) as HTMLDivElement;
        const parentElement = ref.current.parentElement;

        if (
          parentElement?.querySelector(
            `cloned-${lastActivity.cardData.character}-${lastActivity.cardData.type}`
          )
        ) {
          return null;
        }

        ref.current.parentElement?.appendChild(clonedNode);

        if (clonedNode && clonedNodeContainer) {
          await delayTime(0);
          clonedNode.classList.remove("scale-0");
          clonedNode.style.width = "112px";
          clonedNode.style.height = "176px";

          if (lastActivity.cardData.status !== "closed") {
            clonedNodeContainer.style.transform = "rotateY(0deg)";
          }

          await delayTime(1000);

          if (lastActivity.cardData.status !== "closed") {
            let [x, y] = [
              boardData.getBoundingClientRect().x -
                clonedNode.getBoundingClientRect().x -
                clonedNode.clientWidth,
              boardData.getBoundingClientRect().y -
                clonedNode.getBoundingClientRect().y -
                clonedNode.clientHeight / 2,
            ];

            if (
              lastActivity.cardData.value < 7 ||
              (lastActivity.cardData.character === "A" &&
                lastActivity.closeType === "lower")
            ) {
              y += 96;
            } else if (
              lastActivity.cardData.value > 7 ||
              (lastActivity.cardData.character === "A" &&
                lastActivity.closeType === "upper")
            ) {
              y -= 96;
            }

            clonedNode.style.zIndex = "102";
            clonedNode.style.transitionDuration = "2s";
            clonedNode.style.transform = ` translateX(${x}px) translateY(${y}px)`;

            await delayTime(2000);

            if (
              lastActivity.cardData.character === "A" &&
              lastActivity.closeType === "lower"
            ) {
              y -= 96;
              clonedNode.style.zIndex = "102";
              clonedNode.style.transitionDuration = "500ms";
              clonedNode.style.transform = ` translateX(${x}px) translateY(${y}px)`;
            } else if (
              lastActivity.cardData.character === "A" &&
              lastActivity.closeType === "upper"
            ) {
              y += 96;
              clonedNode.style.zIndex = "102";
              clonedNode.style.transitionDuration = "500ms";
              clonedNode.style.transform = ` translateX(${x}px) translateY(${y}px)`;
            }

            await delayTime(500);

            let oldWidth = document.body.clientWidth;
            let oldHeight = document.body.clientHeight;

            const resizingFunction = () => {
              clonedNode.style.transitionDuration = "0s";
              const newWidth = document.body.clientWidth;
              const newHeight = document.body.clientHeight;
              let position = getXAndYFromTransformProperty(clonedNode);
              let width = oldWidth - newWidth;
              let height = oldHeight - newHeight;
              oldWidth = newWidth;
              oldHeight = newHeight;

              clonedNode.style.transform = `translateX(${
                +position[0] + width / 2
              }px) translateY(${position[1] + height / 2}px)`;
            }

            window.addEventListener("resize", resizingFunction);

            return {clonedNode, resizingFunction};
          } else {
            // await delayTime(1000);
            clonedNode.classList.add("scale-0");
            await delayTime(1000);
            clonedNode.remove();
          }
        }

        return {clonedNode, resizingFunction: null};
      }
    };

    let animating = animate();

    return () => {
      animating.then((result) => {
        if(result){
          const {clonedNode, resizingFunction} = result;
          if (clonedNode) {
            clonedNode.remove();
          }
          if(resizingFunction){
            window.removeEventListener("resize",  resizingFunction)
          }
        }
      });
    };
  }, [lastActivity]);
  return (
    <div className="right-6 flex flex-col gap-4">
      {playersData
        .filter((p) => p.id != currPlayer.id)
        .map((player) => {
          return (
            <div
              key={player.name}
              className={`border p-4 rounded relative ${
                player.id === currTurn.id && "border-red-500"
              }`}
            >
              <div className="flex justify-between text-sm mb-3 gap-4 items-center">
                <p className="font-semibold capitalize max-w-28 overflow-hidden whitespace-nowrap text-ellipsis">
                  {player.name}
                </p>
                <p className="text-xs">
                  {
                    (player.cards ?? []).filter((p) => p.status === "open")
                      .length
                  }{" "}
                  Cards
                </p>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {(player.cards ?? []).map((card) =>
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

              {lastActivity?.playerId != currPlayer.id &&
                lastActivity?.playerId === player.id && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 -left-4 -translate-x-full ${
                      !animateActivity.scaleNormal && "scale-0"
                    } duration-1000 transition`}
                    ref={ref}
                    key={`${lastActivity?.cardData.character} - ${lastActivity?.cardData.type}`}
                  >
                    <CardItem
                      character={lastActivity?.cardData.character ?? ""}
                      type={lastActivity?.cardData.type ?? "spade"}
                      width={animateActivity.width}
                      height={animateActivity.height}
                      isFlipped={animateActivity.isFlip}
                    />
                  </div>
                )}
            </div>
          );
        })}
    </div>
  );
}
