"use client";

import DOMPurify from "dompurify";

type Props = {
  content: string;
  className?: string;
};

export default function RichTextDescription({ content, className = "" }: Props) {
  if (!content) return null;
  // Sanitize com perfil HTML básico — você pode ajustar conforme necessidade
  const clean = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
  return (
    <div className={`prose max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
