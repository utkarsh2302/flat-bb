import Image from "next/image";

/** A real photo tile with a premium gradient scrim and optional caption. */
export default function PhotoBlock({
  src,
  label,
  tall,
  priority,
  rounded,
}: {
  src: string;
  label: string;
  tall?: boolean;
  priority?: boolean;
  rounded?: boolean;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${tall ? "h-56" : "h-48"} ${rounded ? "rounded-md" : ""}`}>
      <Image
        src={src}
        alt={label}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="img-cover transition-transform duration-700 ease-out hover:scale-105"
        priority={priority}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
      {label && (
        <span className="absolute bottom-3 left-3 rounded-sm bg-black/35 px-2.5 py-1 text-[13px] font-medium text-white backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}
