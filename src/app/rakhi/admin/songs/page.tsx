"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music, Plus, Play, Pause, Trash2 } from "lucide-react";

export default function SongLibraryPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);

  // New Song Form State
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("Emotional");
  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/admin/songs");
      if (res.ok) {
        const json = await res.json();
        setSongs(json.songs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlay = (song: any) => {
    if (playingId === song.id) {
      if (activeAudio) activeAudio.pause();
      setPlayingId(null);
      setActiveAudio(null);
    } else {
      if (activeAudio) activeAudio.pause();
      const audio = new Audio(song.audioUrl);
      audio.play();
      setActiveAudio(audio);
      setPlayingId(song.id);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !audioUrl) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          mood,
          audioUrl,
          coverUrl: coverUrl || null,
        }),
      });

      if (res.ok) {
        setTitle("");
        setArtist("");
        setAudioUrl("");
        setShowAdd(false);
        fetchSongs();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSong = async (id: string) => {
    if (!confirm("Delete this song from library?")) return;
    try {
      const res = await fetch(`/api/admin/songs?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSongs((prev) => prev.filter((s) => s.id !== id));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Song Library</h1>
          <p className="text-sm text-gray-600 font-semibold">
            Background BGM audio tracks used during the sister experience and final letter reveal.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md border border-rose-200"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>ADD SONG</span>
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAddSong}
          className="bg-white border-2 border-rose-200 rounded-3xl p-6 space-y-4 shadow-xl"
        >
          <h3 className="font-serif text-lg font-bold text-gray-900">Add New Audio Track</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                SONG TITLE *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Phoolon Ka Taron Ka Flute BGM"
                className="w-full p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-bold text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                ARTIST *
              </label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Instrumental BGM"
                className="w-full p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-bold text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              AUDIO URL (MP3) *
            </label>
            <input
              type="url"
              required
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://cdn.example.com/song.mp3"
              className="w-full p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-mono text-xs font-bold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
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
              {submitting ? "SAVING..." : "SAVE TRACK"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-white border-2 border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs hover:border-[#E07A5F] transition-all"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTogglePlay(song)}
                className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] flex items-center justify-center shrink-0 hover:bg-rose-100 cursor-pointer shadow-xs"
              >
                {playingId === song.id ? (
                  <Pause className="w-5 h-5 fill-[#E07A5F]" />
                ) : (
                  <Play className="w-5 h-5 fill-[#E07A5F] ml-0.5" />
                )}
              </button>

              <div>
                <h4 className="font-serif text-base font-bold text-gray-900">{song.title}</h4>
                <p className="text-xs text-gray-600 font-semibold">{song.artist} • {song.mood}</p>
              </div>
            </div>

            <button
              onClick={() => handleDeleteSong(song.id)}
              className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
