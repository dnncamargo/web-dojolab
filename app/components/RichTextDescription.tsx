// app/components/RichTextDescription.tsx
import React from "react";

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

  return (
    <div
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextDescription;
