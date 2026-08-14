"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  PlusCircle,
  Eye,
  Edit,
} from "lucide-react";

interface AnalyticsData {
  totalSisters: number;
  publishedSisters: number;
  draftSisters: number;
  totalQuestions: number;
  totalResponses: number;
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
}

interface SisterSummary {
  id: string;
  name: string;
  photoUrl?: string | null;
  status: string;
  questionCount: number;
  responseCount: number;
  completedCount: number;
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [sisters, setSisters] = useState<SisterSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resAnalytics, resSisters] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/sisters"),
      ]);

      if (resAnalytics.ok) setAnalytics(await resAnalytics.json());
      if (resSisters.ok) {
        const json = await resSisters.json();
        setSisters(json.sisters || []);
      }
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
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
    <div className="space-y-8 text-gray-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-600 font-semibold">
            Manage experiences, track sister responses, and configure personalized flows.
          </p>
        </div>

        <Link
          href="/rakhi/admin/sisters/new"
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-extrabold text-sm shadow-md border border-rose-200"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>+ CREATE SISTER</span>
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-600 text-xs font-bold">
            <span>Total Sisters</span>
            <Users className="w-4 h-4 text-[#E07A5F]" />
          </div>
          <div className="text-3xl font-bold font-serif text-gray-900">
            {analytics?.totalSisters ?? 0}
          </div>
          <div className="text-[11px] text-emerald-800 font-bold font-mono">
            {analytics?.publishedSisters ?? 0} Published • {analytics?.draftSisters ?? 0} Drafts
          </div>
        </div>

        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-600 text-xs font-bold">
            <span>Questions Built</span>
            <HelpCircle className="w-4 h-4 text-[#E07A5F]" />
          </div>
          <div className="text-3xl font-bold font-serif text-gray-900">
            {analytics?.totalQuestions ?? 0}
          </div>
          <div className="text-[11px] text-gray-600 font-bold font-mono">Personalized flows</div>
        </div>

        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-600 text-xs font-bold">
            <span>Sister Responses</span>
            <MessageSquare className="w-4 h-4 text-[#E07A5F]" />
          </div>
          <div className="text-3xl font-bold font-serif text-gray-900">
            {analytics?.totalResponses ?? 0}
          </div>
          <div className="text-[11px] text-purple-700 font-bold font-mono">Saved in database</div>
        </div>

        <div className="bg-white border-2 border-rose-200 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-600 text-xs font-bold">
            <span>Completed Climax</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-serif text-gray-900">
            {analytics?.completedSessions ?? 0}
          </div>
          <div className="text-[11px] text-emerald-800 font-bold font-mono">
            {analytics?.completionRate ?? 0}% Completion Rate
          </div>
        </div>
      </div>

      {/* Sisters List Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-gray-900">Sisters Experiences</h2>
          <Link
            href="/rakhi/admin/sisters"
            className="text-xs text-[#E07A5F] hover:underline font-bold flex items-center gap-1"
          >
            View All ({sisters.length})
          </Link>
        </div>

        {sisters.length === 0 ? (
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-10 text-center space-y-4 shadow-xs">
            <div className="p-4 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] inline-block">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900">No Sister Experiences Created Yet</h3>
            <p className="text-sm text-gray-600 font-semibold max-w-md mx-auto">
              Create your first sister experience and assign her a mandatory 6-digit access code!
            </p>
            <Link
              href="/rakhi/admin/sisters/new"
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-extrabold text-xs shadow-md border border-rose-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>CREATE FIRST SISTER</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sisters.map((sis) => (
              <div
                key={sis.id}
                className="bg-white border-2 border-rose-200 rounded-2xl p-5 space-y-4 shadow-sm hover:border-[#E07A5F] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-rose-300 bg-rose-50 shrink-0">
                      {sis.photoUrl ? (
                        <Image src={sis.photoUrl} alt={sis.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#E07A5F]">
                          {sis.name[0]}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-gray-900">{sis.name}</h4>
                      <span className="text-[10px] text-gray-600 font-semibold">
                        {sis.questionCount} Questions
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      sis.status === "published"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                        : "bg-amber-50 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {sis.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-200 text-xs">
                  <Link
                    href={`/rakhi/admin/sisters/${sis.id}`}
                    className="py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-[#E07A5F] font-bold text-center flex items-center justify-center gap-1 hover:bg-rose-100 shadow-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Manage Hub</span>
                  </Link>

                  <Link
                    href={`/rakhi/admin/sisters/${sis.id}/preview`}
                    className="py-2 px-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-bold text-center flex items-center justify-center gap-1 hover:bg-gray-100 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Preview</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
