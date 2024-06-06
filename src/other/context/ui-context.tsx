import { createContext, useState } from "react";

interface UIContextI {
  isDialog: boolean;
  isAutoSkip: boolean;
  toggleDialog: () => void;
  setAutoSkip: (val: boolean) => void;
}

const context: UIContextI = {
  isDialog: false,
  isAutoSkip: false,
  toggleDialog: () => {},
  setAutoSkip: (val) => {},
};

export const UIContext = createContext(context);

export const UIContextProvider = ({ children }: any) => {
  const [data, setData] = useState<UIContextI>({
    isDialog: false,
    isAutoSkip: false,
    toggleDialog: () => {
      setData((old) => {
        old.isDialog = !old.isDialog;

        return { ...old };
      });
    },
    setAutoSkip: (val) => {
      setData((old) => {
        old.isAutoSkip = val;

        return { ...old };
      });
    }
  });

  return <UIContext.Provider value={data}>{children}</UIContext.Provider>;
};
