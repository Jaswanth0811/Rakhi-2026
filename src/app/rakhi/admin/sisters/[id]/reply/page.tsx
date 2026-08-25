"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, HeartHandshake, Calendar, Sparkles, Volume2, MessageCircle } from "lucide-react";

export default function SisterReplyViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sister, setSister] = useState<any | null>(null);
  const [reply, setReply] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSisterReply();
  }, [id]);

  const fetchSisterReply = async () => {
    try {
      const res = await fetch(`/api/admin/sisters/${id}/reply`);
      if (res.ok) {
        const json = await res.json();
        setSister(json.sister);
        setReply(json.reply);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#E07A5F]">
        <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-gray-900">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <Link
          href={`/rakhi/admin/sisters/${id}`}
          className="p-2.5 rounded-xl bg-white border border-rose-200 text-gray-700 hover:text-gray-900 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Her Letter — {sister?.name}
          </h1>
          <p className="text-xs text-gray-600 font-semibold">
            The personal letter and reply message {sister?.name} sent back to you.
          </p>
        </div>
      </div>

      {/* Main Parchment Reply Card */}
      <div className="relative bg-[#FFFBEB] border-2 border-amber-300/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(217,119,6,0.15)] text-left">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-amber-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm bg-white shrink-0">
              {sister?.photoUrl ? (
                <Image src={sister.photoUrl} alt={sister.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-amber-800 text-xl">
                  {sister?.name?.[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                Letter From {sister?.name} ❤️
              </h3>
              <span className="text-[10px] text-amber-800 uppercase tracking-widest font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" /> Sister Reply Message
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-900 shadow-xs">
            <HeartHandshake className="w-6 h-6 text-[#E07A5F]" />
          </div>
        </div>

        {/* Letter Body Content */}
        {reply ? (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#FEF3C7]/60 border border-amber-300/80 shadow-inner">
              <p className="font-serif text-lg sm:text-xl text-slate-900 leading-relaxed font-bold whitespace-pre-wrap">
                &ldquo;{reply.message}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-amber-900 font-bold pt-2 px-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                Sent on: {new Date(reply.answeredAt).toLocaleString()}
              </span>
              <span className="uppercase text-[10px] tracking-widest font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                SAVED IN DATABASE
              </span>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="p-4 rounded-full bg-amber-100 text-amber-700 w-16 h-16 mx-auto flex items-center justify-center border border-amber-300">
              <MessageCircle className="w-8 h-8 text-amber-700" />
            </div>
            <h4 className="font-serif text-lg font-bold text-gray-900">No Reply Sent Yet</h4>
            <p className="text-xs text-gray-600 font-semibold max-w-sm mx-auto">
              When {sister?.name} completes her Rakhi experience and types her reply letter, it will automatically appear right here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
