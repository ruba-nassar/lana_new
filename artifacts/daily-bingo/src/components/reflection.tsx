import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateReflection,
  getListReflectionsQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const reflectionSchema = z.object({
  whatIChose: z.string().min(1),
  whatIDid: z.string().min(10, "Please share a bit more about what you did."),
  impact: z.string().min(10, "Please describe how it affected you."),
});

interface ReflectionFormProps {
  /** The text of today's active challenge — auto-populates whatIChose */
  challengeText?: string;
}

export function ReflectionForm({ challengeText }: ReflectionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof reflectionSchema>>({
    resolver: zodResolver(reflectionSchema),
    defaultValues: {
      whatIChose: challengeText ?? "",
      whatIDid: "",
      impact: "",
    },
  });

  const createMutation = useCreateReflection({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Reflection saved ✨",
          description: "Thank you for taking a moment to reflect today.",
        });
        form.reset({ whatIChose: challengeText ?? "", whatIDid: "", impact: "" });
        setSubmitted(true);
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListReflectionsQueryKey() });
      },
      onError: () => {
        toast({
          title: "Couldn't save",
          description: "Please try again in a moment.",
          variant: "destructive",
        });
      },
    },
  });

  const onSubmit = (values: z.infer<typeof reflectionSchema>) => {
    createMutation.mutate({ data: values });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-8 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-serif text-lg font-semibold">Reflection saved!</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Your thoughts have been recorded. See you tomorrow for your next challenge.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs text-primary hover:underline underline-offset-2 mt-1"
        >
          Add another reflection
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-serif text-xl font-bold text-foreground">Daily Reflection</h2>
        </div>
        <p className="text-sm text-muted-foreground pl-[2.6rem]">
          Take a moment to capture what happened today.
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Today's challenge display — auto-associated */}
        {challengeText && (
          <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1.5">
              Today's challenge
            </p>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {challengeText}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="whatIDid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    What did you actually do today?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the specific action you took, even if it was small…"
                      className="resize-none h-24 text-sm bg-background border-border/60 focus-visible:ring-primary/30 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    How did it impact you?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How did it make you feel? What shifted for you, even a little?"
                      className="resize-none h-24 text-sm bg-background border-border/60 focus-visible:ring-primary/30 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full sm:w-auto px-8 rounded-xl"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving…" : "Save Reflection"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
