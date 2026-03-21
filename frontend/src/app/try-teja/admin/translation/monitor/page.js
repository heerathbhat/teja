import { Suspense } from "react";
import TranslationMonitorClient from "./TranslationMonitorClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranslationMonitorClient />
    </Suspense>
  );
}