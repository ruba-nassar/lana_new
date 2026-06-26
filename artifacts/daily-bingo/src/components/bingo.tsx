import {
  BingoCardWithBoxes,
  BingoBox,
  useRevealBingoBox,
  useCompleteBingoBox,
  getGetBingoCardQueryKey,
  getListBingoCardsQueryKey,
} from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

type DailyStatus = "active" | "past" | "future";

const CAT = {
  Spirit: { bar: "bg-purple-400", border: "border-t-purple-400", badge: "bg-purple-100 text-purple-700", glow: "shadow-purple-100" },
  Mind:   { bar: "bg-blue-400",   border: "border-t-blue-400",   badge: "bg-blue-100 text-blue-700",   glow: "shadow-blue-100" },
  Body:   { bar: "bg-green-400",  border: "border-t-green-400",  badge: "bg-green-100 text-green-700",  glow: "shadow-green-100" },
  Health: { bar: "bg-orange-400", border: "border-t-orange-400", badge: "bg-orange-100 text-orange-700",glow: "shadow-orange-100" },
  People: { bar: "bg-pink-400",   border: "border-t-pink-400",   badge: "bg-pink-100 text-pink-700",   glow: "shadow-pink-100" },
} as const;

type CatKey = keyof typeof CAT;

function getCat(category: string) {
  return CAT[category as CatKey] ?? CAT.Spirit;
}

export function getTodayBoxIndex(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((todayDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diffDays, 0), 8);
}

interface BingoCardGridProps {
  card: BingoCardWithBoxes;
  dailyMode?: boolean;
  readOnly?: boolean;
}

export function BingoCardGrid({ card, dailyMode = false, readOnly = false }: BingoCardGridProps) {
  const sortedBoxes = [...(card.boxes || [])].sort((a, b) => a.boxNumber - b.boxNumber);
  const todayIndex = dailyMode ? getTodayBoxIndex(card.createdAt) : 8;
  const completedCount = sortedBoxes.filter(b => b.isCompleted).length;

  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      {dailyMode && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Progress
          </span>
          <span className="text-xs text-muted-foreground">
            {completedCount} of 9 done
          </span>
        </div>
      )}

      {/* Progress dots */}
      {dailyMode && (
        <div className="flex gap-1.5 px-1">
          {sortedBoxes.map((box, idx) => (
            <div
              key={box.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                box.isCompleted
                  ? getCat(box.category).bar
                  : idx === todayIndex
                  ? "bg-primary/40"
                  : idx < todayIndex
                  ? "bg-muted-foreground/20"
                  : "bg-muted-foreground/10"
              }`}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {sortedBoxes.map((box, idx) => {
          let dailyStatus: DailyStatus = "active";
          if (dailyMode) {
            if (idx < todayIndex) dailyStatus = "past";
            else if (idx > todayIndex) dailyStatus = "future";
            else dailyStatus = "active";
          }
          return (
            <BingoBoxCell
              key={box.id}
              box={box}
              cardId={card.id}
              readOnly={readOnly}
              index={idx}
              dailyStatus={dailyStatus}
            />
          );
        })}
      </div>
    </div>
  );
}

function BingoBoxCell({
  box,
  cardId,
  readOnly,
  index,
  dailyStatus,
}: {
  box: BingoBox;
  cardId: number;
  readOnly: boolean;
  index: number;
  dailyStatus: DailyStatus;
}) {
  const queryClient = useQueryClient();
  const cat = getCat(box.category);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetBingoCardQueryKey(cardId) });
    queryClient.invalidateQueries({ queryKey: getListBingoCardsQueryKey() });
  };

  const revealMutation = useRevealBingoBox({ mutation: { onSuccess: invalidate } });
  const completeMutation = useCompleteBingoBox({ mutation: { onSuccess: invalidate } });
  const isLoading = revealMutation.isPending || completeMutation.isPending;
  const canInteract = !readOnly && dailyStatus === "active";

  /* ── FUTURE ──────────────────────────────────────────────────────────────── */
  if (dailyStatus === "future") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="aspect-square"
      >
        <div className="w-full h-full min-h-[90px] sm:min-h-[110px] rounded-xl border border-border/40 bg-muted/20 flex flex-col items-center justify-center gap-1 select-none">
          <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />
          <span className="text-[9px] font-semibold text-muted-foreground/30 uppercase tracking-widest">
            Day {index + 1}
          </span>
        </div>
      </motion.div>
    );
  }

  /* ── COMPLETED (past or active) ──────────────────────────────────────────── */
  if (box.isCompleted) {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.4, delay: index * 0.03 }}
        className="aspect-square"
      >
        <div className={`w-full h-full min-h-[90px] sm:min-h-[110px] rounded-xl border-2 border-t-4 ${cat.border} border-border/30 bg-card flex flex-col items-start justify-between p-3 shadow-sm overflow-hidden`}>
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-[10px] sm:text-xs font-medium text-foreground leading-snug line-clamp-3 mt-1">
            {box.challengeText}
          </p>
          <span className={`text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${cat.badge} mt-1`}>
            {box.category}
          </span>
        </div>
      </motion.div>
    );
  }

  /* ── PAST NOT COMPLETED (missed) ─────────────────────────────────────────── */
  if (dailyStatus === "past") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="aspect-square"
      >
        <div className="w-full h-full min-h-[90px] sm:min-h-[110px] rounded-xl border border-border/30 bg-muted/15 flex flex-col items-center justify-center gap-1 opacity-50 select-none">
          <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Day {index + 1}</span>
        </div>
      </motion.div>
    );
  }

  /* ── ACTIVE + REVEALED ───────────────────────────────────────────────────── */
  if (box.isRevealed) {
    return (
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="aspect-square"
      >
        <div className={`w-full h-full min-h-[90px] sm:min-h-[110px] rounded-xl border-2 border-t-4 ${cat.border} border-primary/20 bg-card flex flex-col items-start justify-between p-3 shadow-lg ${cat.glow}`}>
          <div className="w-full">
            <span className={`text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${cat.badge}`}>
              {box.category}
            </span>
            <p className="text-[10px] sm:text-xs font-medium text-foreground leading-snug mt-2 line-clamp-4">
              {box.challengeText}
            </p>
          </div>
          {canInteract && (
            <Button
              size="sm"
              className="w-full h-7 text-[10px] sm:text-xs mt-2"
              onClick={() => completeMutation.mutate({ id: box.id })}
              disabled={isLoading}
            >
              {isLoading ? "…" : "Done!"}
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  /* ── ACTIVE + HIDDEN (tap to reveal) ─────────────────────────────────────── */
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.4, delay: index * 0.03 }}
      className="aspect-square"
    >
      <div
        onClick={canInteract ? () => revealMutation.mutate({ id: box.id }) : undefined}
        className={`w-full h-full min-h-[90px] sm:min-h-[110px] rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all duration-200 select-none
          ${canInteract ? "cursor-pointer hover:bg-primary/10 hover:border-primary/70 hover:shadow-md active:scale-95" : ""}
        `}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-[10px] sm:text-xs font-bold text-primary">Today's Challenge</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground">Tap to reveal</p>
        </div>
      </div>
    </motion.div>
  );
}
