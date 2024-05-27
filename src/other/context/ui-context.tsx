import { createContext, useState } from "react";

interface UIContextI {
  isDialog: boolean;
  toggleDialog: () => void;
}

const context: UIContextI = {
  isDialog: false,
  toggleDialog: () => {},
};

const UIContext = createContext(context);

export const UIContextProvider = ({ children }: any) => {
  const [data, setData] = useState<UIContextI>({
    isDialog: false,
    toggleDialog: () => {
      setData((old) => {
        old.isDialog = !old.isDialog;

        return { ...old };
      });
    },
  });

  return <UIContext.Provider value={data}>{children}</UIContext.Provider>;
};
