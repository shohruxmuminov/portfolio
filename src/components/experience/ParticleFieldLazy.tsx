"use client";

import dynamic from "next/dynamic";

/** Loads Three.js after hydration so text and the loader paint first. */
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

export default function ParticleFieldLazy() {
  return <ParticleField />;
}
