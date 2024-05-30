import { createContext, useState } from "react";

interface UIContextI {
  isDialog: boolean;
  isDrag: boolean;
  toggleDialog: () => void;
  setDrag: (val: boolean) => void;
}

const context: UIContextI = {
  isDialog: false,
  isDrag: false,
  toggleDialog: () => {},
  setDrag: (val) => {},
};

export const UIContext = createContext(context);

export const UIContextProvider = ({ children }: any) => {
  const [data, setData] = useState<UIContextI>({
    isDialog: false,
    isDrag: false,
    toggleDialog: () => {
      setData((old) => {
        old.isDialog = !old.isDialog;

        return { ...old };
      });
    },
    setDrag: (val) => {
      setData((old) => {
        old.isDrag = val;

        return { ...old };
      });
    }
  });

  return <UIContext.Provider value={data}>{children}</UIContext.Provider>;
};
