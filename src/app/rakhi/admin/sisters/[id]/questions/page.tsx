"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  Check,
  X,
  MessageSquare,
  Sparkles,
  Smile,
  Heart,
  PartyPopper,
} from "lucide-react";

interface OptionData {
  id?: string;
  label: string;
  value: string;
  responseMessage: string;
  animationType: string;
}

interface QuestionItem {
  id: string;
  sisterId: string;
  question: string;
  type: string;
  displayOrder: number;
  animationType?: string | null;
  options: OptionData[];
}

const ANIMATION_TYPES = [
  { value: "confetti", label: "Confetti 🎉" },
  { value: "celebration", label: "Celebration 🥳" },
  { value: "funny_shake", label: "Funny Shake 😂" },
  { value: "emotional", label: "Emotional Love 💖" },
  { value: "happy", label: "Happy Smile 😊" },
];

const REACTION_PRESETS = [
  "Haha! I totally knew it! 😂",
  "Aww, you are the sweetest sister! ❤️",
  "Wait, really?! How could you say that! 😜",
  "10/10 best sister in the world! 🌟",
  "Forever my favorite sister! 🌸",
  "That brings back so many memories! 🥹",
];

export default function SisterQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sister, setSister] = useState<any | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Add Modal State
  const [activeModal, setActiveModal] = useState<"add" | "edit" | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [options, setOptions] = useState<OptionData[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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

  const openAddModal = () => {
    setEditingQuestionId(null);
    setQuestionText("");
    setQuestionType("multiple_choice");
    setOptions([
      { label: "Option 1", value: "Option 1", responseMessage: "Haha, great choice! 😂", animationType: "confetti" },
      { label: "Option 2", value: "Option 2", responseMessage: "Aww, love you too! ❤️", animationType: "emotional" },
    ]);
    setActiveModal("add");
  };

  const openEditModal = (q: QuestionItem) => {
    setEditingQuestionId(q.id);
    setQuestionText(q.question);
    setQuestionType(q.type);

    if (q.options && q.options.length > 0) {
      setOptions(
        q.options.map((opt) => ({
          id: opt.id,
          label: opt.label,
          value: opt.value || opt.label,
          responseMessage: opt.responseMessage || "Great choice! ❤️",
          animationType: opt.animationType || "confetti",
        }))
      );
    } else {
      setOptions([
        {
          label: q.type === "text" ? "Text Response" : "Rating Response",
          value: q.type === "text" ? "text_input" : "rating_input",
          responseMessage: "Loved reading your answer! ❤️",
          animationType: "confetti",
        },
      ]);
    }
    setActiveModal("edit");
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setSubmitting(true);
    try {
      let formattedOptions = [...options];

      // If text or rating question, ensure at least one option exists to store the custom reaction
      if (questionType === "text" || questionType === "rating") {
        if (formattedOptions.length === 0) {
          formattedOptions = [
            {
              label: questionType === "text" ? "Text Answer" : "Rating Answer",
              value: questionType === "text" ? "text_input" : "rating_input",
              responseMessage: "Loved your answer! ❤️",
              animationType: "confetti",
            },
          ];
        }
      }

      if (activeModal === "edit" && editingQuestionId) {
        // Update existing question
        const res = await fetch("/api/admin/questions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingQuestionId,
            question: questionText.trim(),
            type: questionType,
            options: formattedOptions,
          }),
        });

        if (res.ok) {
          setSuccessMsg("Question and reactions updated successfully! ✨");
          setTimeout(() => setSuccessMsg(""), 3000);
          setActiveModal(null);
          fetchSisterData();
        }
      } else {
        // Create new question
        const res = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sisterId: id,
            question: questionText.trim(),
            type: questionType,
            options: formattedOptions,
          }),
        });

        if (res.ok) {
          setSuccessMsg("New question added successfully! ✨");
          setTimeout(() => setSuccessMsg(""), 3000);
          setActiveModal(null);
          fetchSisterData();
        }
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
    <div className="space-y-6 max-w-4xl mx-auto text-gray-900 pb-16">
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
              Questions & Reactions Builder — {sister?.name}
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              Customize each question, answer option, and its unique pop-up reaction message.
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md border border-rose-200"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>ADD NEW QUESTION</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Edit / Add Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleSaveQuestion}
            className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-w-2xl w-full my-8 text-gray-900 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-serif text-xl font-extrabold text-gray-900">
                {activeModal === "edit" ? "✏️ Edit Question & Reactions" : "✨ Add New Question"}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-rose-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                Question Text ❓
              </label>
              <input
                type="text"
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="e.g. Who is more annoying between us? 😂"
                className="w-full p-3.5 rounded-xl bg-rose-50/50 border-2 border-rose-200 text-gray-900 font-bold focus:border-[#E07A5F] focus:outline-none text-sm"
              />
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                Question Type 🎨
              </label>
              <select
                value={questionType}
                onChange={(e) => {
                  const newT = e.target.value;
                  setQuestionType(newT);
                  if (newT === "yes_no") {
                    setOptions([
                      { label: "Yes, definitely! ❤️", value: "YES", responseMessage: "I knew you'd say that! 🥰", animationType: "emotional" },
                      { label: "No way! 😜", value: "NO", responseMessage: "Haha, stop lying! 😂", animationType: "funny_shake" },
                    ]);
                  } else if (newT === "text" || newT === "rating") {
                    setOptions([
                      {
                        label: newT === "text" ? "Text Answer" : "Rating Answer",
                        value: newT === "text" ? "text_input" : "rating_input",
                        responseMessage: "Loved reading your answer! ❤️",
                        animationType: "confetti",
                      },
                    ]);
                  }
                }}
                className="w-full p-3.5 rounded-xl bg-rose-50/50 border-2 border-rose-200 text-gray-900 font-bold focus:border-[#E07A5F] focus:outline-none text-sm cursor-pointer"
              >
                <option value="multiple_choice">Multiple Choice (Buttons Grid)</option>
                <option value="yes_no">Yes / No Choice</option>
                <option value="emoji">Emoji Choice</option>
                <option value="rating">Rating Slider (1-10)</option>
                <option value="text">Text Response Box</option>
                <option value="image_choice">Photo Memory Choice</option>
              </select>
            </div>

            {/* Options and their Individual Reactions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                  Options & Custom Reaction Pop-ups 💬
                </label>
                {questionType !== "text" && questionType !== "rating" && (
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
                    className="text-xs text-[#E07A5F] font-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>

              {/* List of Option Cards */}
              <div className="space-y-3">
                {options.map((opt, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3 relative shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-[#E07A5F] uppercase tracking-wider font-mono">
                        {questionType === "text"
                          ? "When she submits text:"
                          : questionType === "rating"
                          ? "When she submits rating:"
                          : `Option ${i + 1}`}
                      </span>

                      {questionType !== "text" && questionType !== "rating" && options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
                          title="Remove option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Option Label (for non-text/rating) */}
                    {questionType !== "text" && questionType !== "rating" && (
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                          Option Label / Button Text
                        </label>
                        <input
                          type="text"
                          required
                          value={opt.label}
                          onChange={(e) => {
                            const next = [...options];
                            next[i].label = e.target.value;
                            next[i].value = e.target.value;
                            setOptions(next);
                          }}
                          placeholder="e.g. Definitely You! 😜"
                          className="w-full p-2.5 rounded-xl bg-white border border-rose-200 text-gray-900 text-xs font-bold"
                        />
                      </div>
                    )}

                    {/* Custom Reaction Message for this Option */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-gray-600 uppercase">
                          Pop-up Reaction Message for this Answer:
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        value={opt.responseMessage}
                        onChange={(e) => {
                          const next = [...options];
                          next[i].responseMessage = e.target.value;
                          setOptions(next);
                        }}
                        placeholder="e.g. Haha! You know that's not true! 😂"
                        className="w-full p-2.5 rounded-xl bg-white border border-rose-300 text-gray-900 text-xs font-bold focus:border-[#E07A5F] focus:outline-none"
                      />
                    </div>

                    {/* Animation Style Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                        Reaction Animation & Sound Style:
                      </label>
                      <select
                        value={opt.animationType}
                        onChange={(e) => {
                          const next = [...options];
                          next[i].animationType = e.target.value;
                          setOptions(next);
                        }}
                        className="w-full p-2.5 rounded-xl bg-white border border-rose-200 text-gray-900 text-xs font-bold"
                      >
                        {ANIMATION_TYPES.map((anim) => (
                          <option key={anim.value} value={anim.value}>
                            {anim.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quick Reaction Preset Chips */}
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                        Quick Preset Suggestions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {REACTION_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const next = [...options];
                              next[i].responseMessage = preset;
                              setOptions(next);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-rose-200 text-gray-700 font-semibold hover:border-[#E07A5F] hover:text-[#E07A5F] cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-rose-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2.5 px-5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
                }}
                className="py-2.5 px-6 rounded-xl text-white font-extrabold text-xs shadow-md border border-rose-200 cursor-pointer"
              >
                {submitting ? "SAVING..." : activeModal === "edit" ? "UPDATE QUESTION & REACTIONS" : "SAVE QUESTION"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-10 text-center space-y-3 shadow-xs">
            <HelpCircle className="w-8 h-8 text-[#E07A5F] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-gray-900">No questions added yet</h3>
            <p className="text-xs text-gray-600 font-semibold">
              Click &quot;ADD NEW QUESTION&quot; to build the story and custom reactions for {sister?.name}.
            </p>
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white border-2 border-rose-200 rounded-3xl p-5 sm:p-6 space-y-4 relative hover:border-[#E07A5F] transition-all shadow-xs"
            >
              {/* Question Header & Action Buttons */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#E07A5F] px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 shrink-0">
                    Q{String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-extrabold text-gray-900">{q.question}</h3>
                    <span className="inline-block mt-1 text-[10px] text-gray-600 uppercase tracking-widest font-mono font-bold bg-gray-100 px-2 py-0.5 rounded-md">
                      TYPE: {q.type.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => openEditModal(q)}
                    className="p-2 bg-rose-50 border border-rose-200 text-[#E07A5F] hover:bg-rose-100 rounded-xl cursor-pointer flex items-center gap-1.5 text-xs font-extrabold shadow-xs"
                    title="Edit Question & Reactions"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options & Configured Reactions Display */}
              {q.options && q.options.length > 0 && (
                <div className="pt-2 border-t border-rose-100 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                    Configured Options & Reactions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt: any) => (
                      <div
                        key={opt.id || opt.label}
                        className="p-3 rounded-2xl bg-[#FFF9F6] border border-rose-200 text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1 font-bold text-gray-900">
                          <span>🔘 {opt.label}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-rose-200 text-[#E07A5F] font-mono">
                            {opt.animationType || "confetti"}
                          </span>
                        </div>
                        {opt.responseMessage && (
                          <div className="text-[11px] text-[#E07A5F] font-bold flex items-start gap-1 bg-white p-2 rounded-xl border border-rose-100">
                            <MessageSquare className="w-3 h-3 mt-0.5 shrink-0 text-[#E07A5F]" />
                            <span>&ldquo;{opt.responseMessage}&rdquo;</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
