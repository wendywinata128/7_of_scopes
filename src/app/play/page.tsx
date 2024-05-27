import { Suspense } from "react";
import PagePlayContainer from "./play-page-container";

export default function Page() {
  return (
    <Suspense>
      <PagePlayContainer />
    </Suspense>
  );
}
