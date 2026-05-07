"use client";

export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Blob 1 – orange, top-left */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#F58D3D]/15 blur-3xl"
        style={{ animation: "blobFloat 30s ease-in-out infinite" }}
      />
      {/* Blob 2 – green, top-right */}
      <div
        className="absolute -top-12 -right-32 w-80 h-80 rounded-full bg-[#22C55E]/10 blur-3xl"
        style={{ animation: "blobFloat 40s ease-in-out infinite reverse" }}
      />
      {/* Blob 3 – blue, bottom-center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full bg-[#4B83C8]/10 blur-3xl"
        style={{ animation: "blobFloat 25s ease-in-out infinite 5s" }}
      />
    </div>
  );
}
