import React, { useState } from 'react';
import { Video, Play, Download, BookOpen, Clock, Award, FileText } from 'lucide-react';
import { COURTROOM_VIDEOS } from '../../data/legalData';

export const CourtroomPracticalsView: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState(COURTROOM_VIDEOS[0]);

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 8
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-white mt-2">Courtroom Practicals & Video Demonstrations</h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl mt-1">
            Video learning hub led by Senior Advocates of Nigeria (SAN) and retired Justices on Filing Cases, Service of Processes, Calling Witnesses, Tendering Electronic Exhibits, Cross-Examination, and Final Written Addresses.
          </p>
        </div>

        {/* Video Player Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Video Stage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group">
              <img
                src={selectedVideo.thumbnailUrl}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

              <button
                onClick={() => alert(`Playing video stream: ${selectedVideo.title}`)}
                className="relative z-10 w-16 h-16 rounded-full bg-yellow-400 text-neutral-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
              >
                <Play className="w-8 h-8 fill-neutral-950 ml-1" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                <div>
                  <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {selectedVideo.topic}
                  </span>
                  <h2 className="text-lg font-bold font-serif text-white mt-1">{selectedVideo.title}</h2>
                </div>
                <span className="text-xs bg-neutral-900/90 text-yellow-400 font-mono px-2.5 py-1 rounded border border-neutral-700">
                  {selectedVideo.duration}
                </span>
              </div>
            </div>

            {/* Video Summary Notes */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Instructor Lecture Notes
              </h3>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
                {selectedVideo.summaryNotes}
              </p>

              <div className="pt-3 border-t border-neutral-800 flex flex-wrap gap-2">
                {selectedVideo.downloadableMaterials.map((mat, i) => (
                  <button
                    key={i}
                    onClick={() => alert(`Downloading course note: ${mat}`)}
                    className="bg-neutral-950 hover:bg-neutral-800 text-yellow-400 text-xs px-3 py-1.5 rounded-lg border border-neutral-800 flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{mat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Practical Masterclass Modules</h2>
            {COURTROOM_VIDEOS.map((vid) => (
              <button
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className={`w-full text-left p-4 rounded-2xl border transition flex gap-3 ${
                  selectedVideo.id === vid.id
                    ? 'bg-neutral-900 border-yellow-400 shadow-xl'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="w-20 h-14 rounded-lg bg-neutral-800 overflow-hidden relative shrink-0">
                  <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>

                <div className="flex-1">
                  <span className="text-[10px] text-yellow-400 font-bold uppercase">{vid.topic}</span>
                  <h3 className="text-xs font-bold font-serif text-white line-clamp-2 mt-0.5">{vid.title}</h3>
                  <span className="text-[10px] text-neutral-500 block mt-1">{vid.instructorName}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
