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
    cardsData!.player = currPlayer;
    gameInfo.boardCapsa.push(cardsData);
  }

  const valuesPlayers = Object.values(gameInfo.players);
  const keys = Object.keys(gameInfo.players);

  let isWaris = false;

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
      let currTurnOld = { ...gameInfo.currentTurn };
      gameInfo.currentTurn =
        idx === valuesPlayers.length - 1
          ? gameInfo.players[keys[0]]
          : gameInfo.players[keys[idx + 1]];

      let i = 0;
      let j = idx;

      while (
        gameInfo.skippedCapsa!.some((p) => p.id === gameInfo.currentTurn.id) ||
        !(gameInfo.currentTurn?.cards ?? []).some((c) => c.status === "open") ||
        (gameInfo.currentTurn?.cards ?? []).length === 0
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

        if (gameInfo.currentTurn.id === currTurnOld.id) {
          // kalo turnnya balik ke dia lagi, barti sudah ga ada yang bisa jalan, atau dia adalah last turnnya.
          // penentuan selanjutnya ada di siapa yang naruh kartu terakhir di board.
          var data = gameInfo.boardCapsa![gameInfo.boardCapsa!.length - 1];
          if (data) {
            let idx = valuesPlayers.findIndex((p) => p.id === data.player!.id);
            let lastPlayer = valuesPlayers[idx];

            if ((lastPlayer.cards ?? []).length > 0) {
              gameInfo.currentTurn = lastPlayer;
            } else {
              gameInfo.currentTurn =
                idx === valuesPlayers.length - 1
                  ? gameInfo.players[keys[0]]
                  : gameInfo.players[keys[idx + 1]];

              let lastPlayerIdx = idx;
              idx++;
              if (idx === valuesPlayers.length) {
                idx = 0;
              }
              while (
                (gameInfo.currentTurn.cards ?? []).length === 0 &&
                idx != lastPlayerIdx
              ) {
                gameInfo.currentTurn =
                  idx === valuesPlayers.length - 1
                    ? gameInfo.players[keys[0]]
                    : gameInfo.players[keys[idx + 1]];

                idx++;
                if (idx === valuesPlayers.length) {
                  idx = 0;
                }
              }
            }
          }
          isWaris = true;
          break;
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

  if (
    gameInfo.skippedCapsa.length +
      valuesPlayers.reduce(
        // (sum, old) => sum + ( !(gameInfo.boardCapsa ?? []).some(p => p.player?.id === old.id) && ((old.cards ?? []).length === 0) ? 1 : 0),
        (sum, old) => {
          //  jika kartunya habis
          if(((old.cards ?? []).length === 0)){
            // dan dia bukan pemain terakhir di meja, maka dia masuk dalam pengecekan apakah boardnya akan di closed atau tidak
            if(gameInfo.boardCapsa!.length > 0 && gameInfo.boardCapsa![gameInfo.boardCapsa!.length] && gameInfo.boardCapsa![gameInfo.boardCapsa!.length].player!.id != old.id){
              return sum + 1;
            }
          }

          return sum + 0;
        },
        0
      ) ===
      valuesPlayers.length - 1 ||
    isWaris
  ) {
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
