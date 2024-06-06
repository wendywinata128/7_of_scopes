import {
  ComboCard,
  check1Cards,
  check2CardsCombo,
  check3CardsCombo,
  check4CardsCombo,
  check5CardsCombo,
} from "@/other/capsa";
import { CardI, LastActivityCapsa } from "@/other/constant/constant";
import { UIContext } from "@/other/context/ui-context";
import { useContext } from "react";

export default function CapsaAction({
  activeCardDecks,
  onDrawClicked,
  isPlayerTurn,
  onSkipClicked,
  lastActivity,
}: {
  activeCardDecks: CardI[];
  onDrawClicked: (comboCard: ComboCard) => void;
  onSkipClicked: () => void;
  isPlayerTurn: boolean;
  lastActivity?: LastActivityCapsa | null;
}) {
  const uiContext = useContext(UIContext);
  let comboCardData =
    check5CardsCombo(activeCardDecks) ??
    check4CardsCombo(activeCardDecks) ??
    check3CardsCombo(activeCardDecks) ??
    check2CardsCombo(activeCardDecks) ??
    check1Cards(activeCardDecks);

  return isPlayerTurn ? (
    <div className="absolute -top-14 flex justify-center left-0 right-0 px-2 z-[200]">
      <div className="absolute left-4 flex gap-3 items-stretch">
        <button
          className={` py-2 px-4 rounded ${
            uiContext.isAutoSkip ? "animate-pulse opacity-100 bg-green-500" : 'opacity-40 bg-red-400 '
          }`}
          onClick={() => {
            uiContext.setAutoSkip(!uiContext.isAutoSkip);
          }}
        >
          Auto Skip
        </button>
        {comboCardData != null && (
          <p className="border rounded flex items-center px-6 text-white ">
            {comboCardData?.name}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        {lastActivity && !uiContext.isAutoSkip && (
          <button
            className="bg-red-500 py-2 px-4 rounded"
            onClick={() => onSkipClicked()}
          >
            Skip Turn
          </button>
        )}

        {comboCardData && (
          <button
            className="bg-blue-500 py-2 px-4 rounded"
            onClick={() => onDrawClicked(comboCardData!)}
          >
            Draw Card
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="absolute -top-14 flex left-0 right-0 px-2 z-[200]">
       <button
          className={` py-2 px-4 rounded ${
            uiContext.isAutoSkip ? "animate-pulse opacity-100 bg-green-500" : 'opacity-40 bg-red-400 '
          }`}
          onClick={() => {
            uiContext.setAutoSkip(!uiContext.isAutoSkip);
          }}
        >
          Auto Skip
        </button>
    </div>
  );
}
