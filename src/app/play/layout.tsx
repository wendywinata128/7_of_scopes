'use client'
import { UIContextProvider } from "@/other/context/ui-context";
import firebaseApp from "@/other/storage/firebase";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <UIContextProvider>
      {children}
    </UIContextProvider>
  </>;
}
