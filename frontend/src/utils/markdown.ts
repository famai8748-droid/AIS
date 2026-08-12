// ============================================================
// Markdown formatter utility
// ============================================================

export function formatMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-300">$1</strong>')
    .replace(/^### (.*$)/gim, '<h3 class="font-bold text-emerald-400 text-base mt-3 mb-1">$1</h3>')
    .replace(/^---\s*$/gim, '<hr class="border-slate-700 my-3">');
}
