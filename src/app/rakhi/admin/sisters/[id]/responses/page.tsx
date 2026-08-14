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
      <div className="flex items-center justify-center py-20 text-[#E07A5F]">
        <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            Sister Responses — {sister?.name}
          </h1>
          <p className="text-xs text-gray-600 font-semibold">
            Real-time log of answers, ratings, and memory selections submitted by {sister?.name}.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {responses.length === 0 ? (
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-10 text-center space-y-3 shadow-xs">
            <MessageSquare className="w-8 h-8 text-[#E07A5F] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-gray-900">No responses recorded yet</h3>
            <p className="text-xs text-gray-600 font-semibold">
              When {sister?.name} completes questions, her answers will appear here in real-time.
            </p>
          </div>
        ) : (
          responses.map((resp) => (
            <div
              key={resp.id}
              className="bg-white border-2 border-rose-200 rounded-2xl p-5 space-y-2 hover:border-[#E07A5F] transition-all shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-[#E07A5F] font-bold">
                <span>QUESTION</span>
                <span className="flex items-center gap-1 font-mono text-gray-500 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {new Date(resp.answeredAt).toLocaleString()}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-gray-900">
                {resp.question?.question}
              </h3>

              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-[#E07A5F] font-sans text-sm font-extrabold shadow-inner">
                Answer: &ldquo;{resp.answer}&rdquo;
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
