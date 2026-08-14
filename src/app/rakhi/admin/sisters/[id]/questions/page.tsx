"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  ArrowLeft,
  Check,
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
      <div className="flex items-center justify-center py-20 text-gold">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/rakhi/admin/sisters/${id}`}
            className="p-2 rounded-xl bg-white/5 text-goldlight hover:text-cream"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-cream">
              Questions Builder — {sister?.name}
            </h1>
            <p className="text-xs text-goldlight/60">
              Drag or reorder questions, set answer options and custom reactions.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold via-goldlight to-golddark text-charcoal font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>ADD QUESTION</span>
        </button>
      </div>

      {/* Add Question Form Modal / Box */}
      {showAddForm && (
        <form
          onSubmit={handleAddQuestion}
          className="bg-[#16141D] border border-gold/40 rounded-3xl p-6 space-y-5 shadow-2xl"
        >
          <h3 className="font-serif text-lg font-bold text-cream">New Question</h3>

          <div>
            <label className="block text-xs font-semibold text-goldlight/80 mb-2">
              QUESTION TEXT
            </label>
            <input
              type="text"
              required
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g. Who is more annoying between us? 😂"
              className="w-full p-4 rounded-xl bg-[#0E0D12] border border-gold/30 text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-goldlight/80 mb-2">
              QUESTION TYPE
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#0E0D12] border border-gold/30 text-cream focus:border-gold focus:outline-none"
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
              <label className="block text-xs font-semibold text-goldlight/80">
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
                    className="flex-1 p-3 rounded-xl bg-[#0E0D12] border border-gold/20 text-cream text-xs"
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
                    className="flex-1 p-3 rounded-xl bg-[#0E0D12] border border-gold/20 text-cream text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                    className="p-3 text-rose-400 hover:bg-rose-950/30 rounded-xl"
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
                className="text-xs text-gold font-semibold hover:underline flex items-center gap-1"
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-3 px-5 rounded-xl bg-white/5 text-cream text-xs font-semibold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 rounded-xl bg-gold text-charcoal font-bold text-xs shadow-md"
            >
              {submitting ? "SAVING..." : "SAVE QUESTION"}
            </button>
          </div>
        </form>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-[#16141D] border border-gold/20 rounded-3xl p-10 text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-gold mx-auto" />
            <h3 className="font-serif text-lg font-bold text-cream">No questions added yet</h3>
            <p className="text-xs text-goldlight/60">
              Click &quot;ADD QUESTION&quot; to build the story for {sister?.name}.
            </p>
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-[#16141D] border border-gold/20 rounded-2xl p-5 space-y-3 relative hover:border-gold/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-gold px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/30">
                    Q{String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-cream">{q.question}</h3>
                    <span className="text-[10px] text-goldlight/60 uppercase tracking-widest font-mono">
                      TYPE: {q.type}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-2 text-rose-400 hover:bg-rose-950/30 rounded-lg"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options pills */}
              {q.options && q.options.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gold/10">
                  {q.options.map((opt: any) => (
                    <span
                      key={opt.id}
                      className="text-xs px-3 py-1 rounded-full bg-warmblack border border-gold/30 text-goldlight/90"
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
