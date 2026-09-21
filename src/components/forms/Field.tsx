import { useId } from "react";

export const inputClass =
  "min-h-12 w-full rounded-2xl border border-white/25 bg-black/25 px-4 text-base text-white placeholder:text-white/45 focus:border-brass focus:outline-none";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-bone/85">
        {label}
        {hint && <span className="font-normal text-bone/55"> {hint}</span>}
      </label>
      {children(id)}
    </div>
  );
}

export function Honeypot() {
  // Hidden field: real people never fill it in, many bots do
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormMessage({
  status,
  success,
}: {
  status: { state: string; message?: string };
  success: string;
}) {
  return (
    <div role="status" aria-live="polite" className="min-h-6 text-sm">
      {status.state === "done" && <p className="text-brass">{success}</p>}
      {status.state === "error" && <p className="text-signal">{status.message}</p>}
    </div>
  );
}
