import { AdminLayout } from "@/components/layout";
import { useListReflections, getListReflectionsQueryKey } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { BookOpen } from "lucide-react";

export default function AdminReflections() {
  const { data: reflections, isLoading } = useListReflections({
    query: { queryKey: getListReflectionsQueryKey() },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Reflections</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Read what participants are experiencing on their journey.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : reflections && reflections.length > 0 ? (
          <div className="space-y-4">
            {reflections.map((ref) => (
              <div
                key={ref.id}
                className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
              >
                {/* Card header */}
                <div className="px-5 py-3.5 border-b border-border/40 flex items-center justify-between bg-muted/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{ref.participantName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ref.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="px-5 py-4 space-y-4">
                  {/* Challenge text (auto-populated from today's box) */}
                  {ref.whatIChose && (
                    <div className="rounded-lg bg-primary/5 border border-primary/15 px-3.5 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">Challenge</p>
                      <p className="text-sm italic text-foreground/80 leading-relaxed">{ref.whatIChose}</p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                        What they did
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{ref.whatIDid}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                        Impact
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{ref.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-muted/20 border border-border/40 border-dashed py-16 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No reflections yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs mx-auto">
              They'll appear here once participants start writing about their daily challenges.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
