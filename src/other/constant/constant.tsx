import CardItem from "@/components/card-item";

export type BoardI = {
  spade: CardI[];
  diamond: CardI[];
  club: CardI[];
  heart: CardI[];
};
export const defaultBoardData: BoardI = {
  spade: [],
  diamond: [],
  club: [],
  heart: [],
};

export const defaultActiveCard: CardI[] = [
  {
    character: "7",
    type: "spade",
    value: 7,
  },
  // {
  //   character: "7",
  //   type: "club",
  //   value: 7,
  // },
  // {
  //   character: "7",
  //   type: "diamond",
  //   value: 7,
  // },
  // {
  //   character: "7",
  //   type: "heart",
  //   value: 7,
  // },
];

export const defaultSevenCard: CardI[] = [
  {
    character: "7",
    type: "club",
    value: 7,
  },
  {
    character: "7",
    type: "diamond",
    value: 7,
  },
  {
    character: "7",
    type: "heart",
    value: 7,
  },
];

export interface PlayerI {
  id: string;
  name: string;
  cards: CardI[];
  cardsLength: number;
}

export type CardStatus = "used" | "closed" | "open";

export interface CardI {
  character: string;
  type: TypeCard;
  value: number;
  status?: CardStatus;
  isFlipped?: boolean;
  isCentered?: boolean;
}
export type TypeCard = "spade" | "diamond" | "club" | "heart";

export const TYPE_CARD_DATA: TypeCard[] = ["spade", "club", "diamond", "heart"];

export const generateDefaultCard = (isRandom: boolean = true) => {
  const numberData = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  var result: CardI[] = [];

  TYPE_CARD_DATA.forEach((type) => {
    numberData.forEach((number, idx) => {
      // var randomTest = Math.floor(Math.random() * 100) % 3;
      result.push({
        character: number,
        type: type,
        value: idx + 2,
        // status: 'open',
        isFlipped: false,
        isCentered: false,
        // status:  randomTest === 0 ? 'open' : randomTest === 1 ? 'closed' : 'used',
        status: "open",
      });
    });
  });

  if (!isRandom) return result;

  var m = result.length,
    t,
    i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }

  return result;
};

export type GameStatusType =
  | "waiting"
  | "decking"
  | "giving"
  | "playing"
  | "ended";

export type LastActivity = {
  playerId: string;
  cardData: CardI;
  closeType?: 'upper' | 'lower' | null
};

export interface GameDataI {
  id: string;
  board: BoardI | null;
  activeCard: CardI[];
  status: GameStatusType;
  players: Record<string, PlayerI>;
  cards: CardI[];
  roomMaster: PlayerI;
  currentTurn: PlayerI;
  activities?: Record<string, string>;
  aValue?: number | null;
  config?: {
    [key: string]: any;
  };
  lastActivity?: LastActivity | null;
}
