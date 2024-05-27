import { getDatabase, push, ref, set } from "firebase/database";
import { appDatabase } from "./firebase";
import {
  CardI,
  GameDataI,
  PlayerI,
  defaultActiveCard,
  defaultBoardData,
  generateDefaultCard,
} from "../constant/constant";
import { generateId } from "../constant/global_function";

export function getGamesRef(id: string) {
  const db = appDatabase;

  return ref(db, `games/${id}`);
}

async function saveGameInfo(id: string, gameData: GameDataI){
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
  };

  saveGameInfo(id, gameData);
  await joinGame("", playerData, id);

  return { playerData, gameData };
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
) {
  let activity = '';
  if(cardData.status === 'closed'){
    activity = `${playerInfo.name}|||menutup kartu|||?-?`
  }else{
    activity = `${playerInfo.name}|||mengeluarkan kartu|||${cardData.character}-${cardData.type}`
  }

  await set(push(getGamesRef(gameId + "/activities")), activity);

  return '';
}

export async function shufflingCards(
  gameInfo: GameDataI,
  players: PlayerI[],
  id: string,
) {
  let n = gameInfo.cards.length;
  let playersIndex = 0;

  players.forEach((p) => p.cards = [])

  while (n) {
    players[playersIndex]?.cards.push(gameInfo.cards[n - 1]);
    if(gameInfo.cards[n - 1].character === '7' && gameInfo.cards[n - 1].type === 'spade'){
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

  const keys = Object.keys(gameInfo.players)

  keys.forEach((key, idx) => {
    gameInfo.players[key] = players[idx];
  })

  gameInfo.status = 'decking';

  saveGameInfo(id, gameInfo)
}

export async function playingCards(
  gameInfo: GameDataI,
) {
  gameInfo.status = 'playing';
  saveGameInfo(gameInfo.id, gameInfo)
}

export async function updateBoards(
  gameInfo: GameDataI,
  cardData: CardI,
  currPlayer: PlayerI
) {

  let type = cardData.type;

  if(cardData.status !== 'closed'){
      if (cardData.value === 7) {
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
        if(cardData.value === 2){
          gameInfo.activeCard.push({
            character: "A",
            type: type,
            value: 1,
          });
        }else{
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

  const values = Object.values(gameInfo.players)
  const keys = Object.keys(gameInfo.players)

  values.forEach((value, idx) => {
    if(value.id === currPlayer.id){
      if(cardData.status !== 'closed'){
        gameInfo.players[keys[idx]].cards = gameInfo.players[keys[idx]].cards.filter((c) => c != cardData);
      }else{
        gameInfo.players[keys[idx]].cards.map(card => {
          if(card.character === cardData.character && card.type === cardData.type){
            card.status = 'closed';
          }

          return {...card};
        })
      }
      gameInfo.currentTurn = idx === (values.length - 1) ? gameInfo.players[keys[0]] : gameInfo.players[keys[idx + 1]];
    }
  })

  console.log(gameInfo);

  saveGameInfo(gameInfo.id, gameInfo)
  updateActivity(currPlayer,gameInfo.id, cardData);
}
