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
import {
  ComboCard,
  animateCardsToBoard,
  check1Cards,
  check2CardsCombo,
  check3CardsCombo,
  check4CardsCombo,
  check5CardsCombo,
  getType5Value,
  getTypeValue,
} from "@/other/capsa";
import CapsaAction from "./capsa-action";

export default function PlayerDeckCapsa({
  playerInfo,
  onClick,
  isPlayerTurn = false,
  gameInfo,
}: {
  playerInfo: PlayerI;
  onClick: (card?: ComboCard) => void;
  isPlayerTurn?: boolean;
  gameInfo: GameDataI;
}) {
  const [display, setDisplay] = useState<{ width?: number; height?: number }>(
    {}
  );
  const [activeCardDecks, setActiveCardDecks] = useState<CardI[]>([]);
  const [activeCardRefs, setActiveCardRefs] = useState<HTMLDivElement[]>([]);
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

  const onSkipCard = () => {
    onClick!();
  };

  const onClickCard = async (comboCard: ComboCard) => {
    uiContext.toggleDialog();

    setTimeout(() => {
      uiContext.toggleDialog();
    }, 1000);

    if (gameInfo.lastActivityCapsa && gameInfo.lastActivityCapsa) {
      let activity = {...gameInfo.lastActivityCapsa};
      let board = gameInfo.boardCapsa;

      if(!board) return;

      let n = board.length - 1;
      while(!activity.cardData && n >= 0){
        activity.cardData = board[n];
        n--;
      }

      if(!activity.cardData) return;

      if (activity.cardData!.cards.length != comboCard.cards.length) {
        return;
      }

      if (comboCard.cards.length < 5) {
        if (comboCard.highestCard.value < activity.cardData!.highestCard.value) {
          return;
        } else if (
          comboCard.highestCard.value === activity.cardData!.highestCard.value
        ) {
          if (
            getTypeValue(comboCard.highestCard.type) <
            getTypeValue(activity.cardData!.highestCard.type)
          ) {
            return;
          }
        }
      } else {
        if (
          getType5Value(comboCard.code) < getType5Value(activity.cardData.code)
        ) {
          return;
        } else if (
          getType5Value(comboCard.code) ===
          getType5Value(activity.cardData.code)
        ) {
          if (
            comboCard.highestCard.value < activity.cardData.highestCard.value
          ) {
            return;
          } else if (
            comboCard.highestCard.value === activity.cardData.highestCard.value
          ) {
            if (
              getTypeValue(comboCard.highestCard.type) <
              getTypeValue(activity.cardData.highestCard.type)
            ) {
              return;
            }
          }
        }
      }
    }

    await animateCardsToBoard(activeCardDecks, activeCardRefs, deckRef.current)
    // return;
    onClick!(comboCard);
    setActiveCardDecks([]);
    setActiveCardRefs([]);
  };

  return (
    <>
      <CapsaAction
        activeCardDecks={activeCardDecks}
        onDrawClicked={onClickCard}
        onSkipClicked={onSkipCard}
        isPlayerTurn={isPlayerTurn}
        lastActivity={gameInfo.lastActivityCapsa}
      />
      {(gameInfo.skippedCapsa ?? []).some(c => c.id === playerInfo.id) && <div className="text-center absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 bg-red-500 px-6 p-2 rounded">You Are Skipped in this Round</div>}
      <div
        className="flex flex-wrap gap-4 justify-center pb-3 pt-5 w-full gap-y-6"
        ref={deckRef}
      >
        {(playerInfo.cards ?? []).map((card, idx) => {
          let isActive = activeCardDecks.some(
            (c) => c.character === card.character && c.type === card.type
          );

          const pushCards = () => {
            if (!isActive && activeCardDecks.length < 5) {
              setActiveCardDecks((old) => [...old, card]);
              setActiveCardRefs((refs) => [...refs, cardRefs.current[idx]]);
            } else {
              setActiveCardDecks((old) => [
                ...old.filter(
                  (c) => c.character != card.character || c.type != card.type
                ),
              ]);
              setActiveCardRefs((old) => [
                ...old.filter((c) => c != cardRefs.current[idx]),
              ]);
            }
          };

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
                isActive={isActive && isPlayerTurn && card.status === "open"}
                isPlayerDeckCard={true}
                onClick={(e) => isPlayerTurn && pushCards()}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
