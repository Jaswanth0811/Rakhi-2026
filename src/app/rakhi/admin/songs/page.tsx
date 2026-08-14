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
      <div className="flex items-center justify-center py-20 text-gold">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream">Song Library</h1>
          <p className="text-sm text-goldlight/70">
            Background audio tracks used during the sister experience and final letter reveal.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold via-goldlight to-golddark text-charcoal font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>ADD SONG</span>
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAddSong}
          className="bg-[#16141D] border border-gold/40 rounded-3xl p-6 space-y-4 shadow-2xl"
        >
          <h3 className="font-serif text-lg font-bold text-cream">Add New Audio Track</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-goldlight/80 mb-1">
                SONG TITLE *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Phoolon Ka Taron Ka"
                className="w-full p-3.5 rounded-xl bg-[#0E0D12] border border-gold/30 text-cream text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-goldlight/80 mb-1">
                ARTIST *
              </label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Kishore Kumar / Acoustic Cover"
                className="w-full p-3.5 rounded-xl bg-[#0E0D12] border border-gold/30 text-cream text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-goldlight/80 mb-1">MOOD</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#0E0D12] border border-gold/30 text-cream text-xs"
              >
                <option value="Emotional">Emotional</option>
                <option value="Happy">Happy</option>
                <option value="Nostalgic">Nostalgic</option>
                <option value="Cinematic">Cinematic</option>
                <option value="Celebration">Celebration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-goldlight/80 mb-1">
                AUDIO MP3 URL *
              </label>
              <input
                type="text"
                required
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-3.5 rounded-xl bg-[#0E0D12] border border-gold/30 text-cream text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="py-2.5 px-4 rounded-xl bg-white/5 text-cream text-xs font-semibold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 rounded-xl bg-gold text-charcoal font-bold text-xs shadow-md"
            >
              {submitting ? "SAVING..." : "SAVE SONG"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-[#16141D] border border-gold/20 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-gold/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleTogglePlay(song)}
                className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 text-gold flex items-center justify-center hover:scale-105 transition-all shrink-0 cursor-pointer"
              >
                {playingId === song.id ? (
                  <Pause className="w-5 h-5 fill-gold" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5 fill-gold" />
                )}
              </button>

              <div className="space-y-0.5">
                <h3 className="font-serif text-base font-bold text-cream">{song.title}</h3>
                <p className="text-xs text-goldlight/60">
                  {song.artist} • <span className="text-gold">{song.mood}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDeleteSong(song.id)}
              className="p-2 text-rose-400 hover:bg-rose-950/30 rounded-lg"
              title="Delete Song"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
