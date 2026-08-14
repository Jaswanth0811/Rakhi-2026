"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Calendar } from "lucide-react";

export default function SisterResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sister, setSister] = useState<any | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponsesData();
  }, [id]);

  const fetchResponsesData = async () => {
    try {
      const [resSister, resResp] = await Promise.all([
        fetch(`/api/admin/sisters/${id}`),
        fetch(`/api/admin/responses?sisterId=${id}`),
      ]);
      if (resSister.ok) setSister((await resSister.json()).sister);
      if (resResp.ok) setResponses((await resResp.json()).responses || []);
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
            Sister Responses — {sister?.name}
          </h1>
          <p className="text-xs text-goldlight/60">
            Real-time log of answers, ratings, and memory selections submitted by {sister?.name}.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {responses.length === 0 ? (
          <div className="bg-[#16141D] border border-gold/20 rounded-3xl p-10 text-center space-y-3">
            <MessageSquare className="w-8 h-8 text-gold mx-auto" />
            <h3 className="font-serif text-lg font-bold text-cream">No responses recorded yet</h3>
            <p className="text-xs text-goldlight/60">
              When {sister?.name} completes questions, her answers will appear here in real-time.
            </p>
          </div>
        ) : (
          responses.map((resp) => (
            <div
              key={resp.id}
              className="bg-[#16141D] border border-gold/20 rounded-2xl p-5 space-y-2 hover:border-gold/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-gold">
                <span className="font-bold">QUESTION</span>
                <span className="flex items-center gap-1 font-mono text-goldlight/50 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {new Date(resp.answeredAt).toLocaleString()}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-cream">
                {resp.question?.question}
              </h3>

              <div className="p-3.5 rounded-xl bg-[#0E0D12] border border-gold/30 text-gold font-sans text-sm font-semibold">
                Answer: &ldquo;{resp.answer}&rdquo;
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
