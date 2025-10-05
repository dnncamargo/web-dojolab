// app/utils/htmlUtils.ts
export function decodeHtmlEntities(encoded: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = encoded;
  return txt.value;
}
