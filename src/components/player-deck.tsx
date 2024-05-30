import { BoardI, CardI, GameDataI, PlayerI } from "@/other/constant/constant";
import CardItem from "./card-item";
import {
  MouseEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { UIContext } from "@/other/context/ui-context";

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
  const deckRef = useRef<HTMLDivElement | null>(null);
  const uiContext = useContext(UIContext);

  useLayoutEffect(() => {
    if ((playerInfo.cards ?? []).length) {
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
    closeType?: "upper" | "lower",
    indexCard?: number,
  ) => {

    if(indexCard){
        let elCopied = cardRefs.current[indexCard!].firstChild?.cloneNode(true) as HTMLDivElement;
        const boardData = document.querySelector(
          `#print-board-${card.type}`
        );
    
        elCopied.classList.add('absolute')
        elCopied.classList.remove('scale-105');
        (elCopied.querySelector('.card-front') as HTMLDivElement).classList.remove('hover:bg-gray-300')


        deckRef.current!.appendChild(elCopied!)
        elCopied.classList.add('transition')
        elCopied.style.left = (cardRefs.current[indexCard!].firstChild! as HTMLDivElement).getBoundingClientRect().x + 'px'
        elCopied.style.transition = '1s'
        elCopied.style.width = '112px'
        elCopied.style.height = '176px'
        elCopied.style.zIndex = '200'
    
    
        let [x, y] = [
          boardData!.getBoundingClientRect().x -
          elCopied.getBoundingClientRect().x ,
          boardData!.getBoundingClientRect().y -
          elCopied.getBoundingClientRect().y
        ];

        if (
          card.value < 7 ||
          (card.character === "A" &&
            closeType === "lower")
        ) {
          y += 96;
        } else if (
          card.value > 7 ||
          (card.character === "A" &&
            closeType === "upper")
        ) {
          y -= 96;
        }
    
        elCopied.style.transform = `translateX(${x}px) translateY(${y-16}px)`;

        setTimeout(() => {
          elCopied.remove();
        }, 1500)
    }

    // return;
    if (type === "close") {
      card.status = "closed";
      onClick!(card, closeType);
    } else {
      onClick!(card, closeType);
    }
    uiContext.toggleDialog();
    setTimeout(() => {
      uiContext.toggleDialog();
    }, 1500)
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center pb-3 pt-5 w-full gap-y-6" ref={deckRef}>
        {(playerInfo.cards ?? []).map((card, idx) => {
          let isActive =
            gameInfo.activeCard?.some((active) => {
              if (active.character === "A") {
                let result =
                  active.character === card.character &&
                  active.type === card.type &&
                  (!gameInfo.aValue || active.value === gameInfo.aValue);

                return result;
              }

              return (
                active.character === card.character && active.type === card.type
              );
            }) ?? false;

          let cantClose = (playerInfo.cards ?? []).some(
            (cardInfo) =>
              cardInfo.character === "7" ||
              ((gameInfo.config?.ruleDrawCardAvailable === true &&
                (gameInfo.activeCard?.some((active) => {
                  if (active.character === "A") {
                    return (
                      active.character === cardInfo.character &&
                      active.type === cardInfo.type &&
                      cardInfo.status === "open" &&
                      (!gameInfo.aValue || active.value === gameInfo.aValue)
                    );
                  }

                  return (
                    active.character === cardInfo.character &&
                    active.type === cardInfo.type &&
                    cardInfo.status === "open"
                  );
                }) ??
                  false)) ??
                false)
          );
          // let cantClose = playerInfo.cards.some(
          //   (cardInfo) =>
          //     cardInfo.character === "7" ||
          //     ((gameInfo.config?.ruleDrawCardAvailable === true &&
          //       gameInfo.activeCard?.some(
          //         (active) =>
          //           active.character === cardInfo.character &&
          //           active.type === cardInfo.type &&
          //           cardInfo.status === "open"
          //       )) ??
          //       false)
          // );

          let isClosed = card.status === "closed";
          let isCanCloseUpper =
            card.character === "A" &&
            gameInfo.aValue != 1 &&
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
              className="relative group bg-transparent"
              key={`${card.character} - ${card.type}`}
              ref={(ref) => {
                ref && (cardRefs.current[idx] = ref!);
              }}
            >
              <CardItem
                character={card?.character}
                type={card?.type}
                status={card?.status}
                width={
                  display.width && display.width < 50
                    ? 50
                    : display.width && display.width > 90
                    ? 90
                    : display.width
                }
                height={
                  display.width && display.width < 50
                    ? 75
                    : display.width && display.width > 90
                    ? 135
                    : display.height
                }
                isActive={
                  (isActive || isCanCloseLower || isCanCloseUpper) &&
                  isPlayerTurn &&
                  card.status === "open"
                }
                isPlayerDeckCard={true}
                onClick={(e) =>
                  onClick &&
                  isActive &&
                  isPlayerTurn &&
                  !isClosed &&
                  !isCanCloseLower &&
                  !isCanCloseUpper &&
                  onClickCard(card, "open", undefined, idx)
                }
              />
              {isPlayerTurn && !isClosed && (
                <div
                  className={`z-[110] absolute bottom-full left-0 right-0 flex flex-col gap-3 ${
                    isActive || isCanCloseLower || isCanCloseUpper
                      ? "-translate-y-7"
                      : "-translate-y-3"
                  }`}
                >
                  {!cantClose && (
                    <button
                      className={`opacity-0 group-hover:opacity-100 group-hover:block bg-red-500 py-2 hover:bg-red-600 active:scale-95 rounded transition text-center text-[0.7vw]`}
                      onClick={() => onClick && onClickCard(card, "close")}
                    >
                      Close
                    </button>
                  )}
                  {isCanCloseUpper && (
                    <button
                      className={`opacity-0 group-hover:opacity-100 group-hover:block bg-red-500 py-2 hover:bg-red-600 active:scale-95 rounded transition text-center text-[0.7vw]`}
                      onClick={() =>
                        onClick && onClickCard(card, "open", "upper", idx)
                      }
                    >
                      Upper
                    </button>
                  )}
                  {isCanCloseLower && (
                    <button
                      className={`opacity-0 group-hover:opacity-100 group-hover:block bg-red-500 py-2 hover:bg-red-600 active:scale-95 rounded transition text-center text-[0.7vw]`}
                      onClick={() =>
                        onClick && onClickCard(card, "open", "lower", idx)
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
