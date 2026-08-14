"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, CheckCircle, HelpCircle, MessageSquare } from "lucide-react";

export default function GlobalAnalyticsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-cream">Global Analytics</h1>
        <p className="text-sm text-goldlight/70">
          Aggregate metrics across all sisters, questions, responses, and session completions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#16141D] border border-gold/20 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-goldlight/70 font-medium">Total Sisters</span>
          <div className="text-3xl font-serif font-bold text-cream">{data?.totalSisters || 0}</div>
        </div>

        <div className="bg-[#16141D] border border-gold/20 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-goldlight/70 font-medium">Questions Built</span>
          <div className="text-3xl font-serif font-bold text-cream">{data?.totalQuestions || 0}</div>
        </div>

        <div className="bg-[#16141D] border border-gold/20 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-goldlight/70 font-medium">Total Responses</span>
          <div className="text-3xl font-serif font-bold text-cream">{data?.totalResponses || 0}</div>
        </div>

        <div className="bg-[#16141D] border border-gold/20 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-goldlight/70 font-medium">Completion Rate</span>
          <div className="text-3xl font-serif font-bold text-emerald-400">
            {data?.completionRate || 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
