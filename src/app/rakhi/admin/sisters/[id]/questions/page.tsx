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
} from "lucide-react";

interface OptionData {
  id?: string;
  label: string;
  value: string;
  responseMessage?: string | null;
  animationType?: string | null;
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
      { label: "Option 1", value: "Option 1" },
      { label: "Option 2", value: "Option 2" },
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
          responseMessage: opt.responseMessage || null,
          animationType: opt.animationType || null,
        }))
      );
    } else {
      setOptions([
        {
          label: q.type === "text" ? "Text Response" : "Rating Response",
          value: q.type === "text" ? "text_input" : "rating_input",
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

      if (questionType === "text" || questionType === "rating") {
        if (formattedOptions.length === 0) {
          formattedOptions = [
            {
              label: questionType === "text" ? "Text Answer" : "Rating Answer",
              value: questionType === "text" ? "text_input" : "rating_input",
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
          setSuccessMsg("Question updated successfully! ✨");
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
              Questions Builder — {sister?.name}
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              Create and edit questions and answer options.
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
            className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-w-xl w-full my-8 text-gray-900 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-serif text-xl font-extrabold text-gray-900">
                {activeModal === "edit" ? "✏️ Edit Question" : "✨ Add New Question"}
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
                      { label: "Yes, definitely! ❤️", value: "YES" },
                      { label: "No way! 😜", value: "NO" },
                    ]);
                  } else if (newT === "text" || newT === "rating") {
                    setOptions([
                      {
                        label: newT === "text" ? "Text Answer" : "Rating Answer",
                        value: newT === "text" ? "text_input" : "rating_input",
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

            {/* Options List */}
            {questionType !== "text" && questionType !== "rating" && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                    Answer Options
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setOptions([
                        ...options,
                        {
                          label: `Option ${options.length + 1}`,
                          value: `Option ${options.length + 1}`,
                        },
                      ])
                    }
                    className="text-xs text-[#E07A5F] font-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
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
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 p-3 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 text-xs font-bold focus:border-[#E07A5F] focus:outline-none"
                      />
                      {options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                          className="p-3 text-rose-600 hover:bg-rose-100 rounded-xl cursor-pointer"
                          title="Remove option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                {submitting ? "SAVING..." : activeModal === "edit" ? "UPDATE QUESTION" : "SAVE QUESTION"}
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
              Click &quot;ADD NEW QUESTION&quot; to create interactive questions for {sister?.name}.
            </p>
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white border-2 border-rose-200 rounded-3xl p-5 sm:p-6 space-y-3.5 relative hover:border-[#E07A5F] transition-all shadow-xs"
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
                    title="Edit Question"
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

              {/* Options Pills Display */}
              {q.options && q.options.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-rose-100">
                  {q.options.map((opt: any, optIdx: number) => (
                    <span
                      key={opt.id || optIdx}
                      className="text-xs px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-gray-900 font-bold"
                    >
                      🔘 {opt.label}
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
