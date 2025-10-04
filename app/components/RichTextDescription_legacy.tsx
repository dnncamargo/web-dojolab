// app/components/RichTextDescription.tsx
import React from "react";
import DOMPurify from "dompurify";

interface RichTextDescriptionProps {
  content: string;
  className?: string;
}

/**
 * Componente para exibir um texto rico (negrito, itálico, listas, tabelas, etc.)
 * No momento apenas renderiza o HTML. 
 * Posteriormente poderemos incluir uma toolbar de edição.
 */
const RichTextDescription: React.FC<RichTextDescriptionProps> = ({
  content,
  className = "",
}) => {
  if (!content) return null;

  const safeContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["b", "i", "u", "a", "p", "ul", "ol", "li", "img", "table", "tr", "td", "th"],
    ALLOWED_ATTR: ["href", "target", "src", "alt"],
  });

  return (
    <div
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  );
};

export default RichTextDescription;
