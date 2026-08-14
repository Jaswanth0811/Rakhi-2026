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
      <div className="flex items-center justify-center py-20 text-[#E07A5F]">
        <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Global Analytics</h1>
        <p className="text-sm text-gray-600 font-semibold">
          Aggregate metrics across all sisters, questions, responses, and session completions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Total Sisters</span>
          <div className="text-3xl font-serif font-extrabold text-gray-900">{data?.totalSisters || 0}</div>
        </div>

        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Questions Built</span>
          <div className="text-3xl font-serif font-extrabold text-gray-900">{data?.totalQuestions || 0}</div>
        </div>

        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Total Responses</span>
          <div className="text-3xl font-serif font-extrabold text-gray-900">{data?.totalResponses || 0}</div>
        </div>

        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Completion Rate</span>
          <div className="text-3xl font-serif font-extrabold text-emerald-600">
            {data?.completionRate || 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
