import {
  ComboCard,
  check1Cards,
  check2CardsCombo,
  check3CardsCombo,
  check4CardsCombo,
  check5CardsCombo,
} from "@/other/capsa";
import { CardI, LastActivityCapsa } from "@/other/constant/constant";

export default function CapsaAction({
  activeCardDecks,
  onDrawClicked,
  isPlayerTurn,
  onSkipClicked,
  lastActivity
}: {
  activeCardDecks: CardI[];
  onDrawClicked: (comboCard: ComboCard) => void;
  onSkipClicked: () => void;
  isPlayerTurn: boolean;
  lastActivity?: LastActivityCapsa | null
}) {
  let comboCardData =
    check5CardsCombo(activeCardDecks) ??
    check4CardsCombo(activeCardDecks) ??
    check3CardsCombo(activeCardDecks) ??
    check2CardsCombo(activeCardDecks) ??
    check1Cards(activeCardDecks);

  return isPlayerTurn ? (
    <div className="absolute -top-12 flex justify-between left-0 right-0 items-center px-2">
      <p>{comboCardData?.name}</p>
      <div className="flex gap-4">
        {lastActivity &&  <button
          className="bg-red-500 py-2 px-4 rounded"
          onClick={() => onSkipClicked()}
        >
          Skip Turn
        </button>}

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
    <div></div>
  );
}
