import { GameDataI, TypeCard } from "@/other/constant/constant";
import { useEffect, useRef } from "react";
import {
  ImClubs,
  ImDiamonds,
  ImHeart,
  ImQuestion,
  ImSpades,
} from "react-icons/im";

export default function BoardActivity({ gameInfo }: { gameInfo: GameDataI }) {
  const refEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (refEl.current) {
      refEl.current!.scrollTop = 9999999;
    }
  }, [Object.values(gameInfo.activities ?? {}).length]);

  function getTypeIcon(val: TypeCard) {
    let iconData = {
      spade: <ImSpades className="text-white" />,
      diamond: <ImDiamonds className="text-white" />,
      club: <ImClubs className="text-white" />,
      heart: <ImHeart className="text-white" />,
    };

    return iconData[val] ?? <ImQuestion className="text-white" />;
  }

  return (
    <div
      className="left-8 w-96 relative border px-4 pb-5 rounded text-xs flex flex-col gap-4 h-52 overflow-auto scroll-smooth"
      ref={refEl}
    >
      <div className="static top-0 w-full left-0 right-0 mx-auto bg-white text-black px-4 py-2 z-10 font-semibold text-center">
        Board Activity
      </div>
      {Object.values(gameInfo.activities ?? {}).map((act, idx) => {
        if (act.includes("Players Turn : ") || act.includes("Player Turn : ")) {
          return (
            <p key={`${act} - ${idx}`} className="relative flex items-center">
              <span className="dot w-1 h-1 bg-green-400 rounded-full mr-3" />
              <b className="mr-1">{act}</b>
            </p>
          );
        }

        let [nameData, activity, card, closeType] = act.split("|||");
        let [character, type] = card.split("-");

        return (
          <p key={`${act} - ${idx}`} className="relative flex items-center">
            <span className="dot w-1 h-1 bg-green-400 rounded-full mr-3" />
            <b className="mr-1 max-w-28 overflow-hidden text-ellipsis whitespace-nowrap">
              {nameData}
            </b>{" "}
            {activity + " "}
            <b className="ml-1 flex gap-1 items-center">
              {character} {getTypeIcon(type as TypeCard)}
            </b>
            {closeType && (
              <b className="ml-1">
                {closeType === "upper" ? " Upper Close" : " Lower Close"}
              </b>
            )}
          </p>
        );
      })}
    </div>
  );
}
