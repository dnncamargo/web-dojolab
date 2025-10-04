'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from "@tiptap/extension-link";
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'

import { useEffect } from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),

      Link,
      Image,
    ],
    content: value || "",

    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // salva como HTML no activity.description
    },
  })


  // garante que ao carregar uma descrição já salva, ela apareça
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-2 bg-white">
      {/* Toolbar simples — você pode estilizar/expandir */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className="px-2 py-1 border rounded">S</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded editor.isActive('bulletList') ? 'is-active' : ''">• Lista</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">1. Lista</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
        <button type="button" onClick={() => {
          const url = window.prompt("URL:");
          if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }} className="px-2 py-1 border rounded">Link</button>
        <button type="button" onClick={() => {
          const src = window.prompt("URL da imagem:");
          if (src) editor.chain().focus().setImage({ src }).run();
        }} className="px-2 py-1 border rounded">Imagem</button>
        {/* <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="px-2 py-1 border rounded">Tabela</button> */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="px-2 py-1 border rounded">Undo</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="px-2 py-1 border rounded">Redo</button>
      </div>

      {/* Área de edição */}
      <EditorContent editor={editor} className="prose max-w-none min-h-[200px]" />
    </div>
  );
}

export default RichTextEditor