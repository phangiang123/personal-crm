import { listChores, getChoresForDate } from "@/lib/actions/chores";
import { todayInVietnam } from "@/lib/vn-date";
import { ChoresClient } from "./chores-client";

export const dynamic = "force-dynamic";

export default async function ChoresPage() {
  const todayKey = todayInVietnam();
  const [allChores, todayChores] = await Promise.all([
    listChores(),
    getChoresForDate(todayKey),
  ]);

  return (
    <ChoresClient
      todayChores={todayChores}
      allChores={allChores}
      todayKey={todayKey}
    />
  );
}
