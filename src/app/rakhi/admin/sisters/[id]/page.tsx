"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HelpCircle,
  Mail,
  Wand2,
  KeyRound,
  MessageSquare,
  BarChart3,
  HeartHandshake,
} from "lucide-react";

export default function SisterHubPage({ params }: { params: Promise<{ id: string }> }) {
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
    }
    setLoading(false);
  };

  const handleTogglePublish = async () => {
    if (!sister) return;
    const newStatus = sister.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/sisters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSister({ ...sister, status: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#E07A5F]">
        <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!sister) {
    return <div className="text-center py-20 text-gray-600 font-bold">Sister not found.</div>;
  }

  return (
    <div className="space-y-8 text-gray-900">
      {/* Header Hub */}
      <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-rose-300 shrink-0 bg-rose-50">
            {sister.photoUrl ? (
              <Image src={sister.photoUrl} alt={sister.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-[#E07A5F]">
                {sister.name[0]}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                {sister.name}
              </h1>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                  sister.status === "published"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                    : "bg-amber-50 text-amber-800 border border-amber-300"
                }`}
              >
                {sister.status}
              </span>
            </div>
            <p className="text-xs text-gray-600 font-semibold">
              {sister.questions?.length || 0} Questions • Motion: {sister.motionStyle || "slow_emotional"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleTogglePublish}
            className={`flex-1 md:flex-none py-3 px-5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${
              sister.status === "published"
                ? "bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100"
                : "bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100"
            }`}
          >
            {sister.status === "published" ? "UNPUBLISH" : "PUBLISH EXPERIENCE"}
          </button>

          <Link
            href={`/rakhi/admin/sisters/${id}/preview`}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="flex-1 md:flex-none py-3 px-5 rounded-xl text-white font-extrabold text-xs text-center shadow-md hover:scale-105 transition-all border border-rose-200"
          >
            LIVE PREVIEW
          </Link>
        </div>
      </div>

      {/* Grid of Control Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* NEW CARD: Her Letter */}
        <Link
          href={`/rakhi/admin/sisters/${id}/reply`}
          className="bg-white border-2 border-rose-300 hover:border-[#E07A5F] p-6 rounded-2xl space-y-3 transition-all group shadow-sm hover:shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white group-hover:scale-110 transition-transform shadow-xs">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E07A5F] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              HER RESPONSE
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">Her Letter</h3>
          <p className="text-xs text-gray-600 font-semibold">
            View the personal letter & reply message {sister.name} sent back to you.
          </p>
        </Link>

        <Link
          href={`/rakhi/admin/sisters/${id}/questions`}
          className="bg-white border border-rose-200 hover:border-[#E07A5F] p-6 rounded-2xl space-y-3 transition-all group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-rose-50 text-[#E07A5F] group-hover:scale-110 transition-transform border border-rose-200">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="font-mono text-sm font-bold text-[#E07A5F]">
              {sister.questions?.length || 0} Qs
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">Questions Builder</h3>
          <p className="text-xs text-gray-600 font-semibold">
            Create multiple choice, rating, emoji & text questions with custom reactions.
          </p>
        </Link>

        <Link
          href={`/rakhi/admin/sisters/${id}/message`}
          className="bg-white border border-rose-200 hover:border-[#E07A5F] p-6 rounded-2xl space-y-3 transition-all group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-rose-50 text-[#E07A5F] group-hover:scale-110 transition-transform border border-rose-200">
              <Mail className="w-6 h-6" />
            </div>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">Final Letter</h3>
          <p className="text-xs text-gray-600 font-semibold">
            Edit your personal message to {sister.name} revealed after questions.
          </p>
        </Link>

        <Link
          href={`/rakhi/admin/sisters/${id}/ai`}
          className="bg-white border border-rose-200 hover:border-[#E07A5F] p-6 rounded-2xl space-y-3 transition-all group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-110 transition-transform border border-purple-200">
              <Wand2 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">Gemini 2.5 AI Engine</h3>
          <p className="text-xs text-gray-600 font-semibold">
            Generate dynamic light themes & BGM music recommendations based on your letter.
          </p>
        </Link>

        <Link
          href={`/rakhi/admin/sisters/${id}/security`}
          className="bg-white border border-rose-200 hover:border-[#E07A5F] p-6 rounded-2xl space-y-3 transition-all group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-rose-50 text-[#E07A5F] group-hover:scale-110 transition-transform border border-rose-200">
              <KeyRound className="w-6 h-6" />
            </div>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">Security & Access Code</h3>
          <p className="text-xs text-gray-600 font-semibold">
            Manage her 4-digit DDMM birthday access code & unlock status.
          </p>
        </Link>

        <Link
          href={`/rakhi/admin/sisters/${id}/responses`}
          className="bg-white border border-rose-200 hover:border-[#E07A5F] p-6 rounded-2xl space-y-3 transition-all group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-rose-50 text-[#E07A5F] group-hover:scale-110 transition-transform border border-rose-200">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">Her Answers</h3>
          <p className="text-xs text-gray-600 font-semibold">
            View her answers to your interactive questions.
          </p>
        </Link>

        <Link
          href={`/rakhi/admin/sisters/${id}/analytics`}
          className="bg-white border border-rose-200 hover:border-[#E07A5F] p-6 rounded-2xl space-y-3 transition-all group shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-rose-50 text-[#E07A5F] group-hover:scale-110 transition-transform border border-rose-200">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="font-serif text-lg font-bold text-gray-900">Sister Analytics</h3>
          <p className="text-xs text-gray-600 font-semibold">
            Track view count, completion time & interaction stats.
          </p>
        </Link>
      </div>
    </div>
  );
}
