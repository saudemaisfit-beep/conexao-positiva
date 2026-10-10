import type { UseFormRegisterReturn } from "react-hook-form";

/**
 * Campo-isco anti-spam: invisível e fora da ordem de tabulação. Pessoas não o veem nem o
 * preenchem; robôs que preenchem todos os campos são identificados no servidor.
 */
export function Honeypot({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...registration} />
      </label>
    </div>
  );
}
