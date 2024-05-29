"use client";

import { CardStatus, TypeCard } from "@/other/constant/constant";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { ImClubs, ImDiamonds, ImHeart, ImSpades } from "react-icons/im";

export default function CardItem({
  type,
  character,
  width = 128,
  height = 128 * 1.5,
  isActive = false,
  className,
  onClick,
  style,
  isFlipped = false,
  isCentered = false,
  status = "open",
  isGrayBg = false,
  isPlayerDeckCard = false,
  refs,
}: {
  type: TypeCard;
  character: string;
  status?: CardStatus;
  width?: number;
  height?: number;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  isFlipped?: boolean;
  isCentered?: boolean;
  isGrayBg?: boolean;
  isPlayerDeckCard?: boolean;
  refs?: (el: HTMLDivElement | null | undefined) => void;
}) {
  // const [isFlipped, setIsFlipped] = useState(false);

  function getTypeIcon(val: TypeCard) {
    let iconData = {
      spade: <ImSpades />,
      diamond: <ImDiamonds />,
      club: <ImClubs />,
      heart: <ImHeart />,
    };

    return iconData[val];
  }
  const refEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isCentered) {
      if (refEl.current) {
        var resultX =
          document.body.clientWidth / 2 -
          refEl.current.getBoundingClientRect().x -
          refEl.current.clientWidth * 0.5;
        var resultY =
          document.body.clientHeight / 2 -
          refEl.current.getBoundingClientRect().y -
          refEl.current.clientHeight * 0.5;

        // refEl.current.style.left = resultX + 'px';
        // refEl.current.style.bottom = resultY + 'px';
        refEl.current.style.transform = `translateX(${resultX + "px"
          }) translateY(${resultY + "px"})`;
        // }
      }
    }
  }, [isCentered]);

  return (
    <div
      ref={(el) => {
        refEl.current = el;
        refs && refs(el);
      }}
      style={{
        // width: width > 70 ? width : 60,
        // height: height > 60 ? height : 60 * 1.5,
        width: width,
        height: height,

        perspective: "1000px",
      }}
      className={`bg-transparent cursor-pointer ${className} transition duration-1000 ${isCentered && "z-50 shadow shadow-white/20"
        }`}
      onClick={onClick}
    // onClick={() => setIsFlipped((flip) => !flip)}
    >
      <div
        className={`container w-full h-full relative transition duration-1000`}
        style={{
          transformStyle: "preserve-3d",
          transform: (isFlipped || status === 'closed') ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className={`back absolute w-full h-full bg-red-500 rounded flex items-center justify-center flex-col gap-3 py-2`}
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {isPlayerDeckCard ?
            <div
              className={`flex flex-col items-center text-white text-sm
                }`}
            >
              <p>{character}</p>
              <p>{getTypeIcon(type)}</p>
            </div>
            :
            <><ImSpades className="text-2xl" />
              <ImDiamonds className="text-2xl" />
              <ImHeart className="text-2xl" />
              <ImClubs className="text-2xl" /></>}
        </div>

        <div
          className={`absolute h-full w-full rounded text-black p-1 px-2 text-sm flex flex-col justify-between transition shrink-0 overflow-hidden hover:bg-gray-300 ${isGrayBg ? 'bg-gray-300' : 'bg-white'}  ${isActive ? "scale-105 -translate-y-4" : ""
            }`}
          style={{
            ...style,
            backfaceVisibility: "hidden",
          }}
        >
          <div
            className={`flex flex-col items-center w-fit ${(type === "diamond" || type === "heart") && "text-red-700"
              }`}
          >
            <p>{character}</p>
            <p>{getTypeIcon(type)}</p>
          </div>

          <div
            className={`flex flex-col items-center w-fit rotate-180 ml-auto ${(type === "diamond" || type === "heart") && "text-red-700"
              }`}
          >
            <p>{character}</p>
            <p>{getTypeIcon(type)}</p>
          </div>

          {status !== "open" && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center text-center justify-center z-20 bg-black/40 text-white">
              {status === "closed" ? "CLOSED" : "USED"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
