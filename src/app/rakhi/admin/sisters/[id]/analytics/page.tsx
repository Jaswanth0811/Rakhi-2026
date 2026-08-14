"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, CheckCircle, Clock, Eye } from "lucide-react";

export default function SisterAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sister, setSister] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSister();
  }, [id]);

  const fetchSister = async () => {
    try {
      const res = await fetch(`/api/admin/sisters/${id}`);
      if (res.ok) {
        const json = await res.json();
        setSister(json.sister);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#E07A5F]">
        <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const qCount = sister?.questions?.length || 0;
  const respCount = sister?._count?.responses || 0;
  const sessionCount = sister?._count?.sessions || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-900">
      <div className="flex items-center gap-3">
        <Link
          href={`/rakhi/admin/sisters/${id}`}
          className="p-2.5 rounded-xl bg-white border border-rose-200 text-gray-700 hover:text-gray-900 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Analytics — {sister?.name}
          </h1>
          <p className="text-xs text-gray-600 font-semibold">
            Completion metrics, session logs, and experience engagement for {sister?.name}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Total Questions</span>
          <div className="text-3xl font-serif font-extrabold text-gray-900">{qCount}</div>
        </div>

        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Answers Received</span>
          <div className="text-3xl font-serif font-extrabold text-gray-900">{respCount}</div>
        </div>

        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">Sessions Started</span>
          <div className="text-3xl font-serif font-extrabold text-gray-900">{sessionCount}</div>
        </div>
      </div>

      <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 space-y-4 shadow-md">
        <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" /> Experience Milestone Checklist
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="font-bold text-gray-900">Experience Started</span>
            <span className="text-emerald-700 font-extrabold">✓ Active</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="font-bold text-gray-900">Questions Answered</span>
            <span className="font-mono text-[#E07A5F] font-extrabold">{respCount} / {qCount}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="font-bold text-gray-900">Final Letter Opened</span>
            <span className="text-emerald-700 font-extrabold">✓ Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
