import { getDatabase, push, ref, remove, set } from "firebase/database";
import { appDatabase } from "./firebase";
import {
  CardI,
  GameDataI,
  PlayerI,
  defaultActiveCard,
  defaultBoardData,
  defaultSevenCard,
  generateDefaultCard,
} from "../constant/constant";
import { generateId } from "../constant/global_function";

export function getGamesRef(id: string) {
  const db = appDatabase;

  return ref(db, `games/${id}`);
}

async function saveGameInfo(id: string, gameData: GameDataI) {
  await set(getGamesRef(id), gameData);
}

export async function createGameInfo(name: string, playerInfo: PlayerI | null) {
  // "use server";
  if (!name && !playerInfo) {
    return;
  }
  const id = generateId();
  var playerData: PlayerI = playerInfo ?? {
    id: generateId(),
    name: name,
    cards: [],
    cardsLength: 0,
  };

  let gameData: GameDataI = {
    id: id,
    board: null,
    players: {},
    activeCard: defaultActiveCard,
    status: "waiting",
    cards: generateDefaultCard(),
    roomMaster: playerData,
    currentTurn: playerData,
    config: {
      ruleDrawCardAvailable: false,
    },
    // aValue: 2,
  };

  saveGameInfo(id, gameData);
  await joinGame("", playerData, id);

  return { playerData, gameData };
}

export async function kickPlayersFromRoom(gameData: GameDataI, player: PlayerI) {
  if (gameData.status !== "waiting") return;

  const entries: [string[], PlayerI[]] = [
    Object.keys(gameData.players),
    Object.values(gameData.players),
  ];

  const idxDeleted = entries[1].findIndex((p) => p.id === player.id);

  // remove(getGamesRef(gameData.id + ''))
  await remove(
    getGamesRef(gameData.id + "/players/" + entries[0][idxDeleted])
  );
}

export async function changeRoomMaster(gameData: GameDataI, player: PlayerI) {
  gameData.roomMaster = player;

  saveGameInfo(gameData.id, gameData);
}

export async function printGameTurns(gameInfo: GameDataI) {
  var players = Object.values(gameInfo.players ?? []);

  var currTurnIndex = players.findIndex(
    (p) => p.id === gameInfo.currentTurn.id
  );

  let increment = currTurnIndex;
  let result = [];
  while (result.length < players.length) {
    result.push(players[increment]);
    increment++;
    if (increment === players.length) increment = 0;
  }

  try {
    await set(
      push(getGamesRef(gameInfo.id + "/activities")),
      "Players Turn : " + result.map((r) => r.name).join(" -> ")
    );
  } catch (e) {
    console.error(e);
  }

  return "";
}

export async function resetGame(gameInfo: GameDataI) {
  // "use server";

  gameInfo = {
    ...gameInfo,
    board: null,
    activeCard: defaultActiveCard,
    status: "waiting",
    cards: generateDefaultCard(),
    config: {
      ruleDrawCardAvailable: false,
    },
    aValue: null,
    currentTurn: gameInfo.roomMaster,
    lastActivity: null,
    activities: {},
  };

  saveGameInfo(gameInfo.id, gameInfo);

  // return { playerData, gameData };
}

export async function joinGame(
  name: string,
  playerInfo: PlayerI | null,
  gameId: string
) {
  // "use server";
  if (!name && !playerInfo) {
    return;
  }

  var playerData: PlayerI = playerInfo ?? {
    id: generateId(),
    name: name,
    cards: [],
    cardsLength: 0,
  };

  localStorage.setItem("user-info", JSON.stringify(playerData));

  await set(push(getGamesRef(gameId + "/players/")), playerData);

  return playerData;
}

export async function updateActivity(
  playerInfo: PlayerI,
  gameId: string,
  cardData: CardI,
  closeType?: "upper" | "lower"
) {
  let activity = "";
  if (cardData.status === "closed") {
    activity = `${playerInfo.name}|||menutup kartu|||?-?`;
  } else {
    if (closeType) {
      activity = `${playerInfo.name}|||mengeluarkan kartu|||${cardData.character}-${cardData.type}|||${closeType}`;
    } else {
      activity = `${playerInfo.name}|||mengeluarkan kartu|||${cardData.character}-${cardData.type}`;
    }
  }

  try {
    await set(push(getGamesRef(gameId + "/activities")), activity);
  } catch (e) {
    console.error(e);
  }

  return "";
}

export async function shufflingCards(
  gameInfo: GameDataI,
  players: PlayerI[],
  id: string,
  animationOption?: boolean,
  ruleDrawCardAvailable?: boolean
) {
  let n = (gameInfo.cards ?? []).length;
  let playersIndex = 0;

  players.forEach((p) => (p.cards = []));

  while (n) {
    players[playersIndex]?.cards.push(gameInfo.cards[n - 1]);
    if (
      gameInfo.cards[n - 1].character === "7" &&
      gameInfo.cards[n - 1].type === "spade"
    ) {
      gameInfo.currentTurn = players[playersIndex];
    }
    playersIndex++;

    if (playersIndex === players.length) playersIndex = 0;

    n--;
  }

  players.forEach((player) => {
    player.cards.sort((a, b) =>
      a.type === b.type
        ? a.value > b.value
          ? 1
          : -1
        : a.type > b.type
        ? 1
        : -1
    );
    player.cardsLength = player.cards.length;
  });

  const keys = Object.keys(gameInfo.players);

  keys.forEach((key, idx) => {
    gameInfo.players[key] = players[idx];
  });

  if (animationOption) {
    gameInfo.status = "playing";
  } else {
    gameInfo.status = "decking";
  }

  if (ruleDrawCardAvailable) {
    gameInfo.config = {
      ruleDrawCardAvailable: true,
    };
  } else {
    gameInfo.config = {
      ruleDrawCardAvailable: false,
    };
  }

  saveGameInfo(id, gameInfo);
  printGameTurns(gameInfo);
}

export async function playingCards(gameInfo: GameDataI) {
  gameInfo.status = "playing";
  saveGameInfo(gameInfo.id, gameInfo);
}

export async function updateBoards(
  gameInfo: GameDataI,
  cardData: CardI,
  currPlayer: PlayerI,
  closeType?: "upper" | "lower"
) {
  if (!gameInfo!.board) {
    gameInfo!.board = defaultBoardData();
  }

  if (!gameInfo!.board[cardData.type]) {
    gameInfo!.board[cardData.type] = [];
  }

  if (cardData.status !== "closed") {
    if (cardData.value < 7 || closeType === "lower") {
      gameInfo?.board[cardData.type].unshift(cardData);
    } else {
      gameInfo?.board[cardData.type].push(cardData);
    }
  }

  let type = cardData.type;

  if (cardData.status !== "closed") {
    if (closeType && cardData.character === "A") {
      gameInfo.activeCard = gameInfo.activeCard.filter(
        (card) => card.type !== cardData.type
      );
      gameInfo.aValue = closeType === "lower" ? 1 : 14;
    } else if (cardData.character === "7" && cardData.type === "spade") {
      gameInfo.activeCard.push(...defaultSevenCard);
      gameInfo.activeCard.push({
        character: "8",
        type: type,
        value: 8,
      });
      gameInfo.activeCard.unshift({
        character: "6",
        type: type,
        value: 6,
      });
    } else if (cardData.value === 7) {
      gameInfo.activeCard.push({
        character: "8",
        type: type,
        value: 8,
      });
      gameInfo.activeCard.unshift({
        character: "6",
        type: type,
        value: 6,
      });
    } else if (cardData.value < 7) {
      if (cardData.value === 2) {
        gameInfo.activeCard.push({
          character: "A",
          type: type,
          value: 1,
        });
      } else {
        gameInfo.activeCard.unshift({
          character: `${cardData.value - 1}`,
          type: type,
          value: cardData.value - 1,
        });
      }
    } else {
      gameInfo.activeCard.push({
        character: ["8", "9", "10", "J", "Q", "K", "A"][cardData.value + 1 - 8],
        type: type,
        value: cardData.value + 1,
      });
    }
  }

  const values = Object.values(gameInfo.players);
  const keys = Object.keys(gameInfo.players);

  values.forEach((value, idx) => {
    if (value.id === currPlayer.id) {
      if (cardData.status !== "closed") {
        gameInfo.players[keys[idx]].cards = (
          gameInfo.players[keys[idx]].cards ?? []
        ).filter((c) => c != cardData);
      } else {
        (gameInfo.players[keys[idx]].cards ?? []).map((card) => {
          if (
            card.character === cardData.character &&
            card.type === cardData.type
          ) {
            card.status = "closed";
          }

          return { ...card };
        });
      }
      // gameInfo.currentTurn = gameInfo.players[idx]
      gameInfo.currentTurn =
        idx === values.length - 1
          ? gameInfo.players[keys[0]]
          : gameInfo.players[keys[idx + 1]];

      let i = 0;
      let j = idx;

      // check jika giliran selanjutnya ga punya kartu open, ya balik lagi ke dia sendiri dan kalo dia juga ga punya kartu yaudah langsung selesai gamenya.
      while (
        !(gameInfo.currentTurn?.cards ?? []).some((c) => c.status === "open") &&
        i < values.length + 1
      ) {
        gameInfo.currentTurn =
          j === values.length - 1
            ? gameInfo.players[keys[0]]
            : gameInfo.players[keys[j + 1]];

        j++;
        i++;
        if (j === values.length) {
          j = 0;
        }
      }
    }
  });

  if (
    !Object.values(gameInfo.players ?? []).some((val) =>
      (val.cards ?? []).some((c) => c.status === "open")
    )
  ) {
    gameInfo.status = "ended";
  }

  gameInfo.lastActivity = {
    playerId: currPlayer.id,
    cardData: cardData,
    closeType: closeType ?? null,
  };

  saveGameInfo(gameInfo.id, gameInfo);
  updateActivity(currPlayer, gameInfo.id, cardData, closeType);
}
