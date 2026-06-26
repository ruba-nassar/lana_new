import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout";
import { Spinner } from "@/components/ui/spinner";
import { Users, Grid, CheckCircle2, BookOpen } from "lucide-react";

export default function AdminDashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </AdminLayout>
    );
  }

  if (!summary) return null;

  const stats = [
    {
      label: "Participants",
      value: summary.totalParticipants ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Cards",
      value: summary.totalCards ?? 0,
      icon: Grid,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Challenges Done",
      value: summary.totalBoxesCompleted ?? 0,
      sub: `of ${summary.totalBoxesRevealed ?? 0} revealed`,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Reflections",
      value: summary.totalReflections ?? 0,
      icon: BookOpen,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor engagement and challenge progress across all participants.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                {s.sub && (
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                )}
                <p className="text-xs font-medium text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent reflections */}
        <div>
          <h2 className="text-lg font-serif font-semibold text-foreground mb-4">Recent Reflections</h2>
          <div className="space-y-3">
            {summary.recentReflections && summary.recentReflections.length > 0 ? (
              summary.recentReflections.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-card rounded-xl border border-border/50 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-foreground">{ref.participantName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ref.date).toLocaleDateString()}
                    </span>
                  </div>
                  {ref.whatIChose && (
                    <p className="text-xs italic text-muted-foreground border-l-2 border-primary/30 pl-2.5 py-0.5 mb-2">
                      {ref.whatIChose}
                    </p>
                  )}
                  <p className="text-sm text-foreground/80 leading-relaxed">{ref.impact}</p>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-muted/30 border border-border/40 py-12 text-center text-sm text-muted-foreground">
                No reflections submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
