import { UIContext } from "@/other/context/ui-context";
import { useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";

export default function LoadingScreen() {
  const uiContext = useContext(UIContext);

  return (
    <div>
      {uiContext.isDialog && (
        <div className="absolute left-0 right-0 top-0 bottom-0 bg-black/5 z-[200] flex flex-col gap-3 items-end justify-end p-4">
          <AiOutlineLoading className="animate-spin text-2xl" />
          <p className="text-xs">Loading</p>
        </div>
      )}
    </div>
  );
}
