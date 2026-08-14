"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Edit,
  Eye,
  MessageSquare,
  KeyRound,
  BarChart3,
  Trash2,
} from "lucide-react";

interface SisterItem {
  id: string;
  name: string;
  photoUrl?: string | null;
  status: string;
  questionCount: number;
  responseCount: number;
  completedCount: number;
  lastAccessAt?: string | null;
}

export default function SistersListPage() {
  const [sisters, setSisters] = useState<SisterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSisters();
  }, []);

  const fetchSisters = async () => {
    try {
      const res = await fetch("/api/admin/sisters");
      if (res.ok) {
        const json = await res.json();
        setSisters(json.sisters || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s experience?`)) return;

    try {
      const res = await fetch(`/api/admin/sisters/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSisters((prev) => prev.filter((s) => s.id !== id));
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

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Sisters Experiences</h1>
          <p className="text-sm text-gray-600 font-semibold">
            Create, edit, preview, and manage personalized Rakhi experiences for your sisters.
          </p>
        </div>

        <Link
          href="/rakhi/admin/sisters/new"
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-extrabold text-sm shadow-md border border-rose-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ CREATE SISTER</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sisters.map((sister) => (
          <div
            key={sister.id}
            className="bg-white border-2 border-rose-200 rounded-3xl p-6 space-y-5 shadow-md hover:border-[#E07A5F] transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-rose-300 bg-rose-50">
                  {sister.photoUrl ? (
                    <Image src={sister.photoUrl} alt={sister.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-[#E07A5F]">
                      {sister.name[0]}
                    </div>
                  )}
                </div>

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

              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900">{sister.name}</h3>
                <p className="text-xs text-gray-600 font-semibold">
                  {sister.questionCount} Questions • {sister.responseCount} Responses • {sister.completedCount} Completed
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-rose-200 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/rakhi/admin/sisters/${sister.id}`}
                  className="py-2.5 px-3 rounded-xl bg-rose-50 border border-rose-200 text-[#E07A5F] text-center font-bold flex items-center justify-center gap-1.5 hover:bg-rose-100 shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Hub</span>
                </Link>

                <Link
                  href={`/rakhi/admin/sisters/${sister.id}/preview`}
                  className="py-2.5 px-3 rounded-xl bg-white border border-gray-300 text-gray-800 text-center font-bold flex items-center justify-center gap-1.5 hover:bg-gray-100 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Preview</span>
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/rakhi/admin/sisters/${sister.id}/security`}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#E07A5F] hover:bg-rose-50"
                    title="Access Code"
                  >
                    <KeyRound className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/rakhi/admin/sisters/${sister.id}/responses`}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#E07A5F] hover:bg-rose-50"
                    title="User Responses"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/rakhi/admin/sisters/${sister.id}/analytics`}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#E07A5F] hover:bg-rose-50"
                    title="Analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                </div>

                <button
                  onClick={() => handleDelete(sister.id, sister.name)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Delete Sister"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
