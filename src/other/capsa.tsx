import {
  CardI,
  LastActivityCapsa,
  PlayerI,
  TypeCard,
} from "./constant/constant";
import { delayTime } from "./constant/global_function";

type ComboValue =
  | "straight"
  | "flush"
  | "fullHouse"
  | "fourOfKind"
  | "straightFlush"
  | "royalStraightFlush"
  | string;

export interface ComboCard {
  name: string;
  code: ComboValue;
  highestCard: CardI;
  cards: CardI[];
  player?: PlayerI | null | undefined,
}

export const SEQ_TYPE: Record<TypeCard, number> = {
  diamond: 0,
  club: 1,
  heart: 2,
  spade: 3,
};

export const getTypeValue = (cardType: TypeCard) => {
  return SEQ_TYPE[cardType];
};

const SEQ_TYPE_5: Record<ComboValue, number> = {
  straight: 0,
  flush: 1,
  fullHouse: 2,
  fourOfKind: 3,
  straightFlush: 4,
  royalStraightFlush: 5,
};

export const getType5Value = (c: ComboValue) => {
  return SEQ_TYPE_5[c];
};

export function getCardsCombo(activeCardDecks: CardI[]) {
  return (
    check5CardsCombo(activeCardDecks) ??
    check4CardsCombo(activeCardDecks) ??
    check3CardsCombo(activeCardDecks) ??
    check2CardsCombo(activeCardDecks) ??
    check1Cards(activeCardDecks)
  );
}

export function check5CardsCombo(cards: CardI[]): ComboCard | null {
  if (cards.length !== 5) return null;

  let cardsData = [...cards];
  let setCardCharacter = new Set(cardsData.map((c) => `${c.value}`));
  let setCardType = new Set(cardsData.map((c) => c.type));

  cardsData.sort((a, b) =>
    a.value == b.value
      ? SEQ_TYPE[a.type] > SEQ_TYPE[b.type]
        ? 1
        : -1
      : a.value > b.value
      ? 1
      : -1
  );

  const lastCard = cardsData[cardsData.length - 1];
  let oldCard: CardI | null = null;
  let isStraight = cardsData.every((c) => {
    if (oldCard) {
      if (c.value != oldCard.value + 1) {
        return false;
      }
    }

    oldCard = c;
    return true;
  });

  // if (isStraight) return setCardType.size === 1 ? seq5[4] : seq5[0];
  if (isStraight)
    return {
      name: setCardType.size === 1 ? "Straight Flush" : "Straight",
      code:
        setCardType.size === 1
          ? Object.keys(SEQ_TYPE_5)[4]
          : Object.keys(SEQ_TYPE_5)[0],
      highestCard: lastCard,
      cards: cardsData,
    };

  if (setCardType.size === 1)
    return {
      name: "Flush",
      code: Object.keys(SEQ_TYPE_5)[1],
      highestCard: lastCard,
      cards: cardsData,
    };

  if (setCardCharacter.size === 2) {
    let sizeCard = [0, 0];
    cardsData.forEach((c) => {
      let idx = 0;
      setCardCharacter.forEach((set, set2) => {
        if (`${c.value}` === set) {
          sizeCard[+idx]++;
        }
        idx++;
      });
    });

    let idx3 = 0;
    if (
      sizeCard.some((s, idx) => {
        if (s === 3) {
          idx3 = idx;
          return true;
        }

        return false;
      })
    ) {
      // full house
      let setArrays = Array.from(setCardCharacter);
      return {
        name: "Full House",
        code: Object.keys(SEQ_TYPE_5)[2],
        highestCard:
          cardsData.findLast((c) => `${c.value}` === setArrays[idx3]) ??
          lastCard,
        cards: cardsData,
      };
    }

    if (sizeCard.some((s) => s === 4)) {
      // four of kind
      return {
        name: "Four of Kind",
        code: Object.keys(SEQ_TYPE_5)[3],
        highestCard:
          lastCard.value != cardsData[cardsData.length - 2].value
            ? cardsData[cardsData.length - 2]
            : lastCard,
        cards: cardsData,
      };
    }
  }

  return null;
  // if(setCardCharacter)
}

export function check4CardsCombo(cards: CardI[]): ComboCard | null {
  if (cards.length !== 4) return null;

  let cardsData = [...cards];
  cardsData.sort((a, b) =>
    a.value == b.value
      ? SEQ_TYPE[a.type] > SEQ_TYPE[b.type]
        ? 1
        : -1
      : a.value > b.value
      ? 1
      : -1
  );

  let setCardCharacter = new Set(cardsData.map((c) => `${c.value}`));
  let setCardType = new Set(cardsData.map((c) => c.type));

  if (setCardCharacter.size === 2 || setCardType.size === 2) {
    let result = {
      name: "Two Pair",
      code: "twoPair",
      highestCard: cardsData[cardsData.length - 1],
      cards: cardsData,
    };

    return result;
  }

  return null;
}

export function check3CardsCombo(cards: CardI[]): ComboCard | null {
  if (cards.length !== 3) return null;

  let cardsData = [...cards];
  cardsData.sort((a, b) =>
    a.value == b.value
      ? SEQ_TYPE[a.type] > SEQ_TYPE[b.type]
        ? 1
        : -1
      : a.value > b.value
      ? 1
      : -1
  );

  let setCardCharacter = new Set(cardsData.map((c) => `${c.value}`));

  if (setCardCharacter.size === 1) {
    let result = {
      name: "Three of Kind",
      code: "threeOfKind",
      highestCard: cardsData[cardsData.length - 1],
      cards: cardsData,
    };

    return result;
  }

  return null;
}

export function check2CardsCombo(cards: CardI[]): ComboCard | null {
  if (cards.length !== 2) return null;

  let cardsData = [...cards];
  cardsData.sort((a, b) =>
    a.value == b.value
      ? SEQ_TYPE[a.type] > SEQ_TYPE[b.type]
        ? 1
        : -1
      : a.value > b.value
      ? 1
      : -1
  );

  let setCardCharacter = new Set(cardsData.map((c) => `${c.value}`));

  if (setCardCharacter.size === 1) {
    let result = {
      name: "Pair",
      code: "pair",
      highestCard: cardsData[cardsData.length - 1],
      cards: cardsData,
    };

    return result;
  }

  return null;
}

export function check1Cards(cards: CardI[]): ComboCard | null {
  if (cards.length !== 1) return null;

  let result = {
    name: "Single Card",
    code: "single-card",
    highestCard: cards[0],
    cards: cards,
  };

  return result;
}

export function sortCardByCapsa(cardsData: CardI[]) {
  cardsData.sort((a, b) =>
    a.value == b.value
      ? SEQ_TYPE[a.type] > SEQ_TYPE[b.type]
        ? 1
        : -1
      : a.value > b.value
      ? 1
      : -1
  );
}

export async function animateCardsToBoard(
  cards: CardI[],
  refsCard: HTMLDivElement[],
  deckRef: HTMLDivElement | null
) {
  if (!deckRef) return;

  let cardAndRef = [
    ...cards.map((c, idx) => ({ card: c, ref: refsCard[idx] })),
  ];

  cardAndRef.sort((a, b) =>
    a.card.value == b.card.value
      ? SEQ_TYPE[a.card.type] > SEQ_TYPE[b.card.type]
        ? 1
        : -1
      : a.card.value > b.card.value
      ? 1
      : -1
  );

  let idx = 0;
  let elCopiedData: HTMLDivElement[] = [];
  for (let cr of cardAndRef) {
    // if(idx != 0) {idx++; continue};

    let elCopied = cr.ref.firstChild?.cloneNode(true) as HTMLDivElement;
    const boardData = document.querySelector(`#board-games-capsa`);

    elCopied.classList.add("absolute");
    elCopied.classList.remove("scale-105");
    (elCopied.querySelector(".card-front") as HTMLDivElement).classList.remove(
      "hover:bg-gray-300"
    );

    deckRef.appendChild(elCopied!);
    elCopied.classList.add("transition");
    elCopied.style.left =
      (cr.ref.firstChild! as HTMLDivElement).getBoundingClientRect().x + "px";
    elCopied.style.transition = "1s";
    elCopied.style.width = "110px";
    elCopied.style.height = "155px";
    elCopied.style.zIndex = "200";

    let [x, y] = [
      boardData!.getBoundingClientRect().x - elCopied.getBoundingClientRect().x,
      boardData!.getBoundingClientRect().y - elCopied.getBoundingClientRect().y,
    ];

    let marginLeft =
      boardData!.clientWidth + 2 - ((110 + 10) * cardAndRef.length - 10);
    marginLeft = marginLeft / 2;

    elCopied.style.transform = `translateX(${
      x + marginLeft + idx * (110 + 10)
    }px) translateY(${y - 16 + boardData?.clientHeight! / 2 - 155 / 2}px)`;

    elCopiedData.push(elCopied);
    await delayTime(200);

    idx++;
  }

  // await delayTime(3000);

  elCopiedData.forEach((el) => {
    setTimeout(() => {
      el.remove();
    }, 2000);
  });
}

export async function animatePlayersInfoLastActivity(
  lastActivity: LastActivityCapsa | null | undefined,
  refs: HTMLDivElement | null,
  currPlayer: PlayerI
) {
  if (!lastActivity) return;

  const boardData = document.querySelector(`#board-games-capsa`);
  if (
    refs &&
    boardData &&
    lastActivity &&
    currPlayer.id !== lastActivity?.playerId
  ) {

    if(!lastActivity.cardData){
      let firstChild = refs.firstChild as HTMLDivElement | null;

      if(firstChild){
        let cloneNode = firstChild.cloneNode(true) as HTMLDivElement;
        refs.appendChild(cloneNode);
        await delayTime(100);
        cloneNode.classList.remove('opacity-0')
        delayTime(4000).then(() => {
          cloneNode.classList.add('opacity-0');
        })

        return [cloneNode];
      }

      return null;
    }


    const cardItems = refs.querySelectorAll(".card-item");
    // let i = 0;
    let tempFutures: Promise<HTMLDivElement | null | undefined>[] = [];
    let marginLeft =
    boardData!.clientWidth + 2 - ((110 + 10) * cardItems.length - 10);
    marginLeft = marginLeft / 2;
    await delayTime(500);
    for (let i = 0; i < cardItems.length; i++) {
      const animation = async () => {
        let ref = cardItems[i] as HTMLDivElement;
        let card = lastActivity.cardData?.cards[i];

        // console.log(ref);

        if (card && ref) {
          let clonedNode: HTMLDivElement = ref.cloneNode(
            true
          ) as HTMLDivElement;

          clonedNode.classList.add(
            `cloned-${card.character}-${card.type}`,
            "transition",
            "absolute"
          );

          let clonedNodeContainer = clonedNode.querySelector(
            ".container"
          ) as HTMLDivElement;
          const parentElement = refs.parentElement;

          // if (
          //   parentElement?.querySelector(
          //     `.cloned-${card.character}-${card.type}`
          //   )
          // ) {
          //   return null;
          // }

          parentElement?.appendChild(clonedNode);

          if (clonedNode && clonedNodeContainer) {
            await delayTime(10);
            clonedNode.classList.remove("scale-0");
            clonedNodeContainer.style.transform = "rotateY(0deg)";
            await delayTime(1000);

            clonedNode.style.zIndex = "102";
            clonedNode.style.transitionDuration = "2s";

            let [x, y] = [
              boardData!.getBoundingClientRect().x -
                clonedNode.getBoundingClientRect().x,
              boardData!.getBoundingClientRect().y -
                clonedNode.getBoundingClientRect().y,
            ];

            clonedNode.style.transform = `translateX(${
              x + marginLeft + i * (110 + 10)
            }px) translateY(${y + boardData?.clientHeight! / 2 - 155}px)`;
            await delayTime(1500);

            return clonedNode;
          }

        }
      };

      tempFutures.push(animation());
      await delayTime(500);
    }

    var result = await Promise.all(tempFutures);

    return result;

    // return { clonedNode, resizingFunction: null };
  }
}
