import { BoardI, CardI, GameDataI, PlayerI } from "@/other/constant/constant";
import CardItem from "./card-item";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function PlayerDeck({
  playerInfo,
  onClick,
  isPlayerTurn = false,
  gameInfo,
}: {
  playerInfo: PlayerI;
  onClick?: (card: CardI, closeType?: "upper" | "lower") => void;
  isPlayerTurn?: boolean;
  gameInfo: GameDataI;
}) {
  const [display, setDisplay] = useState<{ width?: number; height?: number }>(
    {}
  );
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (playerInfo.cards.length) {
      let widthEl =
        (document.body.clientWidth -
          16 * (playerInfo.cardsLength - 1) -
          24 * 2) /
        playerInfo.cardsLength;
      setDisplay({ width: widthEl, height: widthEl * 1.5 });

      window.addEventListener("resize", () => {
        let widthEl =
          (document.body.clientWidth -
            16 * (playerInfo.cardsLength - 1) -
            24 * 2) /
          playerInfo.cardsLength;
        setDisplay({ width: widthEl, height: widthEl * 1.5 });
      });

      setTimeout(() => {
        let firstEl = cardRefs.current[0].getBoundingClientRect().x;
        cardRefs.current.forEach((el) => {
          el.style.transform = `translateX(${
            firstEl - el.getBoundingClientRect().x
          }px)`;
        });

        setTimeout(() => {
          cardRefs.current.forEach((el) => {
            el.classList.add("transition", "duration-700");
            el.style.transform = `translateX(${0}px)`;
          });
        }, 300);
      }, 0);
    }
  }, [playerInfo.cardsLength]);

  const onClickCard = (
    card: CardI,
    type: "close" | "open",
    closeType?: "upper" | "lower"
  ) => {
    if (type === "close") {
      card.status = "closed";
      onClick!(card, closeType);
    } else {
      onClick!(card, closeType);
    }
  };

  return (
    <>
      <div className="flex gap-4 justify-center pb-3 pt-5 w-full">
        {playerInfo.cards.map((card, idx) => {
          let isActive =
            gameInfo.activeCard?.some(
              (active) =>
                active.character === card.character && active.type === card.type
            ) ?? false;
          let cantClose = playerInfo.cards.some(
            (cardInfo) =>
              cardInfo.character === "7" ||
              ((gameInfo.config?.ruleDrawCardAvailable === true &&
                gameInfo.activeCard?.some(
                  (active) =>
                    active.character === cardInfo.character &&
                    active.type === cardInfo.type && cardInfo.status === 'open'
                )) ??
                false)
          );
          let isClosed = card.status === "closed";
          let isCanCloseUpper =
            card.character === "A" &&
            gameInfo.aValue != 2 &&
            (gameInfo.board != null
              ? gameInfo.board![card.type] ?? ([] as CardI[])
              : []
            ).some((card) => card.character === "K");
          let isCanCloseLower =
            card.character === "A" &&
            gameInfo.aValue != 14 &&
            (gameInfo.board != null
              ? gameInfo.board![card.type] ?? ([] as CardI[])
              : []
            ).some((card) => card.character === "2");
          return (
            <div
              className="relative group"
              key={idx}
              ref={(ref) => {
                ref && (cardRefs.current[idx] = ref!);
              }}
            >
              <CardItem
                character={card?.character}
                type={card?.type}
                status={card?.status}
                width={display.width}
                height={display.height}
                isActive={isActive && isPlayerTurn && card.status === "open"}
                isPlayerDeckCard={true}
                onClick={() =>
                  onClick &&
                  isActive &&
                  isPlayerTurn &&
                  !isClosed &&
                  !isCanCloseLower &&
                  !isCanCloseUpper &&
                  onClickCard(card, "open")
                }
              />
              {!cantClose && isPlayerTurn && !isClosed && (
                <div
                  className={`z-50 absolute bottom-full left-0 right-0 flex flex-col gap-3 ${
                    isActive ? "-translate-y-7" : "-translate-y-3"
                  }`}
                >
                  <button
                    className={`opacity-0 group-hover:opacity-100 group-hover:block bg-red-500 py-2 hover:bg-red-600 active:scale-95 rounded transition text-center text-[0.7vw]`}
                    onClick={() => onClick && onClickCard(card, "close")}
                  >
                    Close
                  </button>
                  {isCanCloseUpper && (
                    <button
                      className={`opacity-0 group-hover:opacity-100 group-hover:block bg-red-500 py-2 hover:bg-red-600 active:scale-95 rounded transition text-center text-[0.7vw]`}
                      onClick={() =>
                        onClick && onClickCard(card, "open", "upper")
                      }
                    >
                      Upper
                    </button>
                  )}
                  {isCanCloseLower && (
                    <button
                      className={`opacity-0 group-hover:opacity-100 group-hover:block bg-red-500 py-2 hover:bg-red-600 active:scale-95 rounded transition text-center text-[0.7vw]`}
                      onClick={() =>
                        onClick && onClickCard(card, "open", "lower")
                      }
                    >
                      Lower
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
