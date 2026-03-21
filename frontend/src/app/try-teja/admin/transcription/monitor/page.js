import { Suspense } from "react";
import TranscriptionMonitorClient from "./TranscriptionMonitorClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranscriptionMonitorClient />
    </Suspense>
  );
}