import { ParticipantLayout } from "@/components/layout";
import {
  useListBingoCards,
  useGetBingoCard,
  getListBingoCardsQueryKey,
  getGetBingoCardQueryKey,
} from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { BingoCardGrid, getTodayBoxIndex } from "@/components/bingo";
import { ReflectionForm } from "@/components/reflection";
import { useAuth } from "@/lib/auth";
import { Flame } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: cards, isLoading: isCardsLoading } = useListBingoCards({
    query: { queryKey: getListBingoCardsQueryKey() },
  });

  const cardId = cards && cards.length > 0 ? cards[0].id : null;

  const { data: cardWithBoxes, isLoading: isBoxesLoading } = useGetBingoCard(
    cardId ?? 0,
    {
      query: {
        queryKey: getGetBingoCardQueryKey(cardId ?? 0),
        enabled: !!cardId,
      },
    }
  );

  const isLoading = isCardsLoading || (!!cardId && isBoxesLoading);
  const hasCard =
    !!cardWithBoxes &&
    Array.isArray(cardWithBoxes.boxes) &&
    cardWithBoxes.boxes.length > 0;

  const firstName = user?.name?.split(" ")[0] ?? "friend";

  // Derive today's active box for the reflection form
  const sortedBoxes = hasCard
    ? [...cardWithBoxes.boxes].sort((a, b) => a.boxNumber - b.boxNumber)
    : [];
  const todayIndex = hasCard
    ? getTodayBoxIndex(cardWithBoxes.createdAt)
    : 0;
  const todayBox = sortedBoxes[todayIndex] ?? null;
  const todayChallenge = todayBox?.isRevealed ? todayBox.challengeText : undefined;

  const dayLabel = `Day ${todayIndex + 1} of 9`;

  return (
    <ParticipantLayout>
      <div className="max-w-xl mx-auto pb-24 space-y-8">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="pt-8 sm:pt-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 shadow-sm">
            <Flame className="w-7 h-7 text-primary" />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground tracking-wide">
              {getGreeting()}, {firstName} ✦
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground leading-tight">
              Your Daily Challenge
            </h1>
          </div>

          {hasCard && (
            <div className="inline-flex items-center gap-2 bg-card border border-border/50 rounded-full px-4 py-1.5 shadow-sm text-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-medium text-foreground">{dayLabel}</span>
            </div>
          )}

          {!hasCard && !isLoading && (
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Your leader will assign your bingo card soon. Check back tomorrow!
            </p>
          )}
        </section>

        {/* ── Loading ────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner className="w-7 h-7 text-primary" />
          </div>
        )}

        {/* ── Bingo Board ───────────────────────────────────────────── */}
        {!isLoading && hasCard && (
          <section>
            <BingoCardGrid card={cardWithBoxes} dailyMode={true} />
          </section>
        )}

        {/* ── Reflection ────────────────────────────────────────────── */}
        {!isLoading && hasCard && (
          <section>
            <ReflectionForm challengeText={todayChallenge} />
          </section>
        )}

      </div>
    </ParticipantLayout>
  );
}
