import { push, ref, set } from "firebase/database";
import {
  CardI,
  GameDataI,
  PlayerI,
  defaultActiveCard,
  generateDefaultCard,
} from "../constant/constant";
import { generateId } from "../constant/global_function";
import { joinGame } from "./api";
import { appDatabase } from "./firebase";
import { ComboCard, getCardsCombo } from "../capsa";

export function getGamesRef(id: string) {
  const db = appDatabase;

  return ref(db, `games/${id}`);
}

async function saveGameInfo(id: string, gameData: GameDataI) {
  await set(getGamesRef(id), gameData);
}

export async function updateActivity(
  playerInfo: PlayerI,
  gameId: string,
  cardData?: ComboCard
) {
  let activity = "";
  if (cardData) {
    activity = `${playerInfo.name}|||mengeluarkan|||${cardData.name}`;
  } else {
    activity = `${playerInfo.name}|||Skip Card|||?-?`;
  }

  try {
    await set(push(getGamesRef(gameId + "/activities")), activity);
  } catch (e) {
    console.error(e);
  }

  return "";
}

export async function updateActivityWithMessages(
  gameId: string,
  message: string
) {
  try {
    await set(push(getGamesRef(gameId + "/activities")), message);
  } catch (e) {
    console.error(e);
  }

  return "";
}

export async function updateBoardsCapsa(
  gameInfo: GameDataI,
  currPlayer: PlayerI,
  cardsData?: ComboCard
) {
  if (!gameInfo!.boardCapsa) {
    gameInfo!.boardCapsa = [];
  }

  if (!gameInfo!.skippedCapsa) {
    gameInfo.skippedCapsa = [];
  }

  if (!cardsData) {
  } else {
    gameInfo.boardCapsa.push(cardsData);
  }

  const valuesPlayers = Object.values(gameInfo.players);
  const keys = Object.keys(gameInfo.players);

  valuesPlayers.forEach((value, idx) => {
    if (value.id === currPlayer.id) {
      if (cardsData) {
        gameInfo.players[keys[idx]].cards = (
          gameInfo.players[keys[idx]].cards ?? []
        ).filter(
          (c) =>
            !cardsData.cards.some(
              (card) => card.character === c.character && card.type === c.type
            )
        );
      } else {
        gameInfo.skippedCapsa = [...gameInfo.skippedCapsa!, currPlayer];
      }

      // gameInfo.currentTurn = gameInfo.players[idx]
      gameInfo.currentTurn =
        idx === valuesPlayers.length - 1
          ? gameInfo.players[keys[0]]
          : gameInfo.players[keys[idx + 1]];

      let i = 0;
      let j = idx;

      // check jika giliran selanjutnya ga punya kartu open, ya balik lagi ke dia sendiri dan kalo dia juga ga punya kartu yaudah langsung selesai gamenya.
      while (
        ((gameInfo.currentTurn?.cards ?? []).length === 0 || !(gameInfo.currentTurn?.cards ?? []).some(
          (c) => c.status === "open"
        ) ||
          gameInfo.skippedCapsa!.some(
            (p) => p.id === gameInfo.currentTurn.id
          )) &&
        i < valuesPlayers.length + 1
      ) {
        gameInfo.currentTurn =
          j === valuesPlayers.length - 1
            ? gameInfo.players[keys[0]]
            : gameInfo.players[keys[j + 1]];

        j++;
        i++;
        if (j === valuesPlayers.length) {
          j = 0;
        }
      }
    }
  });

  // if (cardsData) {
  gameInfo.lastActivityCapsa = {
    playerId: currPlayer.id,
    cardData: cardsData ?? null,
  };
  // }

  let isBoardReset = false;

  if ((gameInfo.skippedCapsa?.length ?? []) === valuesPlayers.length - 1) {
    gameInfo.lastActivityCapsa = null;
    gameInfo.boardCapsa = null;
    gameInfo.skippedCapsa = null;
    isBoardReset = true;
  }

  const checkPlayersCardLeft = valuesPlayers.reduce(
    (old, val) => old + ((val.cards ?? []).length > 0 ? 1 : 0),
    0
  );

  if (checkPlayersCardLeft === 1) {
    gameInfo.status = "ended";
  }

  saveGameInfo(gameInfo.id, gameInfo);
  updateActivity(currPlayer, gameInfo.id, cardsData).then(() => {
    if (isBoardReset) {
      updateActivityWithMessages(
        gameInfo.id,
        `Board Closed, Player Turn : ${gameInfo.currentTurn.name}`
      );
    }
  });
}
