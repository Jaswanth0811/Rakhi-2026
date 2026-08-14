"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";

export default function SisterQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sister, setSister] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Question Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newType, setNewType] = useState("multiple_choice");
  const [options, setOptions] = useState<Array<{ label: string; value: string; responseMessage: string; animationType: string }>>([
    { label: "Option 1", value: "Option 1", responseMessage: "Great choice! ❤️", animationType: "confetti" },
    { label: "Option 2", value: "Option 2", responseMessage: "I knew it! 😂", animationType: "funny_shake" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSisterData();
  }, [id]);

  const fetchSisterData = async () => {
    try {
      const res = await fetch(`/api/admin/sisters/${id}`);
      if (res.ok) {
        const json = await res.json();
        setSister(json.sister);
        setQuestions(json.sister.questions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sisterId: id,
          question: newQuestionText.trim(),
          type: newType,
          options,
        }),
      });

      if (res.ok) {
        setNewQuestionText("");
        setShowAddForm(false);
        fetchSisterData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`/api/admin/questions?id=${qId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== qId));
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
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/rakhi/admin/sisters/${id}`}
            className="p-2 rounded-xl bg-white border border-rose-200 text-gray-700 hover:text-gray-900 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              Questions Builder — {sister?.name}
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              Create questions, set answer options and custom reactions.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md border border-rose-200"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>ADD QUESTION</span>
        </button>
      </div>

      {/* Add Question Form Modal / Box */}
      {showAddForm && (
        <form
          onSubmit={handleAddQuestion}
          className="bg-white border-2 border-rose-200 rounded-3xl p-6 space-y-5 shadow-xl"
        >
          <h3 className="font-serif text-lg font-bold text-gray-900">New Question</h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              QUESTION TEXT
            </label>
            <input
              type="text"
              required
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g. Who is more annoying between us? 😂"
              className="w-full p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-bold focus:border-[#E07A5F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              QUESTION TYPE
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-bold focus:border-[#E07A5F] focus:outline-none"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="yes_no">Yes / No</option>
              <option value="emoji">Emoji Choice</option>
              <option value="rating">Rating (1-10 Slider)</option>
              <option value="text">Text Answer</option>
              <option value="image_choice">Image Choice</option>
            </select>
          </div>

          {/* Options List */}
          {newType !== "text" && newType !== "rating" && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                ANSWER OPTIONS & REACTIONS
              </label>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => {
                      const next = [...options];
                      next[i].label = e.target.value;
                      next[i].value = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 p-3 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={opt.responseMessage}
                    onChange={(e) => {
                      const next = [...options];
                      next[i].responseMessage = e.target.value;
                      setOptions(next);
                    }}
                    placeholder="Reaction message"
                    className="flex-1 p-3 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                    className="p-3 text-rose-600 hover:bg-rose-100 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setOptions([
                    ...options,
                    {
                      label: `Option ${options.length + 1}`,
                      value: `Option ${options.length + 1}`,
                      responseMessage: "Nice choice! ❤️",
                      animationType: "confetti",
                    },
                  ])
                }
                className="text-xs text-[#E07A5F] font-extrabold hover:underline flex items-center gap-1"
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-3 px-5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
              }}
              className="py-3 px-6 rounded-xl text-white font-extrabold text-xs shadow-md border border-rose-200"
            >
              {submitting ? "SAVING..." : "SAVE QUESTION"}
            </button>
          </div>
        </form>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-10 text-center space-y-3 shadow-xs">
            <HelpCircle className="w-8 h-8 text-[#E07A5F] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-gray-900">No questions added yet</h3>
            <p className="text-xs text-gray-600 font-semibold">
              Click &quot;ADD QUESTION&quot; to build the story for {sister?.name}.
            </p>
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white border-2 border-rose-200 rounded-2xl p-5 space-y-3 relative hover:border-[#E07A5F] transition-all shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#E07A5F] px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200">
                    Q{String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-900">{q.question}</h3>
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest font-mono font-bold">
                      TYPE: {q.type}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options pills */}
              {q.options && q.options.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-rose-200">
                  {q.options.map((opt: any) => (
                    <span
                      key={opt.id}
                      className="text-xs px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-gray-900 font-bold"
                    >
                      {opt.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
