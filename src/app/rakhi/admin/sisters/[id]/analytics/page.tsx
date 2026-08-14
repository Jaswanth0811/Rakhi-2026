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
      <div className="flex items-center justify-center py-20 text-gold">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const qCount = sister?.questions?.length || 0;
  const respCount = sister?._count?.responses || 0;
  const sessionCount = sister?._count?.sessions || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/rakhi/admin/sisters/${id}`}
          className="p-2 rounded-xl bg-white/5 text-goldlight hover:text-cream"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-cream">
            Analytics — {sister?.name}
          </h1>
          <p className="text-xs text-goldlight/60">
            Completion metrics, session logs, and experience engagement for {sister?.name}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#16141D] border border-gold/20 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-goldlight/70 font-medium">Total Questions</span>
          <div className="text-3xl font-serif font-bold text-cream">{qCount}</div>
        </div>

        <div className="bg-[#16141D] border border-gold/20 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-goldlight/70 font-medium">Answers Received</span>
          <div className="text-3xl font-serif font-bold text-cream">{respCount}</div>
        </div>

        <div className="bg-[#16141D] border border-gold/20 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-goldlight/70 font-medium">Sessions Started</span>
          <div className="text-3xl font-serif font-bold text-cream">{sessionCount}</div>
        </div>
      </div>

      <div className="bg-[#16141D] border border-gold/20 rounded-3xl p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-cream flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" /> Experience Milestone Checklist
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0E0D12]">
            <span>Experience Started</span>
            <span className="text-emerald-400 font-bold">✓ Active</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0E0D12]">
            <span>Questions Answered</span>
            <span className="font-mono text-gold">{respCount} / {qCount}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0E0D12]">
            <span>Final Letter Opened</span>
            <span className="text-emerald-400 font-bold">✓ Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
