"use client";
import LoadingScreen from "@/components/loading-screen";
import { UIContext, UIContextProvider } from "@/other/context/ui-context";
import firebaseApp from "@/other/storage/firebase";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UIContextProvider>
        <section>{children}</section>
        <LoadingScreen/>
      </UIContextProvider>
    </>
  );
}
