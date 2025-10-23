'use client'

import { useEffect, useState, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Blockquote from "@tiptap/extension-blockquote";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Heading from '@tiptap/extension-heading'

import clsx from 'clsx'

import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List as ListIcon,
  ListOrdered,
  Quote,
  Code,
  Redo,
  Undo,
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type
} from 'lucide-react'

type DescriptionEditorProps = {
  value: string
  onChange: (html: string) => void
  descriptionType: 'richtext' | 'interactive'
  onSetDescriptionType: (value: 'richtext' | 'interactive') => void
}

const COMMON_COLORS = [
  "#000000",
  "#1f2937", // slate-800
  "#374151",
  "#6b7280",
  "#ef4444", // red
  "#f59e0b", // amber
  "#f97316", // orange
  "#10b981", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f3f4f6", // gray-100 (for light backgrounds)
];

export default function DescriptionEditor({
  value,
  onChange,
  descriptionType,
  onSetDescriptionType
}: DescriptionEditorProps) {
  //const [color, setColor] = useState('#000000');
  const [textColorOpen, setTextColorOpen] = useState(false);
  const [bgColorOpen, setBgColorOpen] = useState(false);

  const isRichText = descriptionType === 'richtext'

  // IMPORTANT: StarterKit already provides list-related extensions (bulletList, orderedList, listItem).
  // Do NOT include BulletList / OrderedList / ListItem again — duplication causa falha no comportamento das listas.
  const extensions = useMemo(() => [
    Document,
    StarterKit,
    Paragraph,
    Text,
    Heading.configure({ levels: [1, 2, 3] }),

    Underline,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      openOnClick: true,
      HTMLAttributes: { class: 'text-blue-600 underline' }
    }),
    Image,
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    TextStyle,
    Color,
    Blockquote,
    HardBreak.configure({
      keepMarks: true,
    }),
    HorizontalRule,
  ], [])

  const editor = useEditor({
    extensions,
    content: isRichText ? (value || '') : '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    immediatelyRender: false, // evita mismatch SSR
    onUpdate: ({ editor }) => {
      if (isRichText) {
        onChange(editor.getHTML())
      }
    },
  })

  // Sincroniza conteúdo externo para o editor sem disparar onUpdate (evita loop)
  useEffect(() => {
    if (editor && isRichText && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor, isRichText])

  const handleToggleType = () => {
    if (isRichText) {
      const confirmChange = confirm(
        'Alternar para o modo HTML/CSS/JS interativo limpará o conteúdo atual do Rich Text. Deseja continuar?'
      )
      if (!confirmChange) return

      onSetDescriptionType('interactive')

      // limpa conteúdo do editor e notifica pai
      editor?.commands.clearContent()
      onChange('')
      alert('Modo interativo (HTML/CSS/JS) ativado. Insira seu código manualmente.')
    } else {
      onSetDescriptionType('richtext')
    }
  }

  const toggleHeadingLevel = () => {
    if (!editor) return

    if (editor.isActive('heading', { level: 1 })) {
      editor.chain().focus().toggleHeading({ level: 2 }).run() // H1 -> H2
    } else if (editor.isActive('heading', { level: 2 })) {
      editor.chain().focus().toggleHeading({ level: 3 }).run() // H2 -> H3
    } else if (editor.isActive('heading', { level: 3 })) {
      editor.chain().focus().setParagraph().run()             // H3 -> P (Texto Normal)
    } else {
      editor.chain().focus().toggleHeading({ level: 1 }).run() // P -> H1
    }
  }

  const applyTextColor = (color: string) => {
    if (!editor) return;
    // set color on selection
    editor.chain().focus().setColor(color).run();
    setTextColorOpen(false);
  };

  const applyBgColor = (color: string) => {
    if (!editor) return;
    // Highlight is a mark; toggleHighlight({ color })
    editor.chain().focus().toggleHighlight({ color }).run();
    setBgColorOpen(false);
  };

  // Helper to clear formatting colors
  const clearTextColor = () => {
    if (!editor) return;
    editor.chain().focus().unsetColor().run();
  };

  const clearBgColor = () => {
    if (!editor) return;
    editor.chain().focus().unsetHighlight().run();
  };

  // small toolbar button component
  const Swatch = ({ color, onClick }: { color: string; onClick: (c: string) => void }) => (
    <button
      type="button"
      aria-label={`Aplicar cor ${color}`}
      onClick={() => onClick(color)}
      className="w-8 h-8 rounded-sm border"
      style={{ background: color, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
    />
  );

  const addLink = () => {
    if (!editor) return
    const url = window.prompt('URL:')
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = () => {
    if (!editor) return
    const src = window.prompt('URL da imagem:')
    if (src) editor.chain().focus().setImage({ src }).run()
  }

  const handleInteractiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  if (isRichText && !editor) return null

  return (
    <div className="border rounded-md p-3 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-3 items-center">
        {isRichText && editor && (
          <>
            <button
              type="button"
              title="Negrito"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={clsx('p-2 rounded hover:bg-gray-200', editor.isActive('bold') && 'bg-gray-300')}
            >
              <Bold size={16} />
            </button>

            <button
              type="button"
              title="Itálico"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={clsx('p-2 rounded hover:bg-gray-200', editor.isActive('italic') && 'bg-gray-300')}
            >
              <Italic size={16} />
            </button>

            <button
              type="button"
              title="Sublinhado"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={clsx('p-2 rounded hover:bg-gray-200', editor.isActive('underline') && 'bg-gray-300')}
            >
              <UnderlineIcon size={16} />
            </button>

            <button
              type="button"
              title="Riscado"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={clsx('p-2 rounded hover:bg-gray-200', editor.isActive('strike') && 'bg-gray-300')}
            >
              <Strikethrough size={16} />
            </button>

            {/* Heading (H1, H2, H3, P)*/}
            <button
              type="button"
              title="Título (H1, H2, H3)"
              onClick={toggleHeadingLevel} // Usa a nova função de ciclo
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                (editor.isActive('heading', { level: 1 }) ||
                  editor.isActive('heading', { level: 2 }) ||
                  editor.isActive('heading', { level: 3 })) && 'bg-gray-300' // Destaca se qualquer um dos níveis H1-H3 estiver ativo
              )}
            >
              <Type size={16} /> {/* Usando o ícone Type */}
            </button>

            <button
              type="button"
              title="Lista com marcadores"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={clsx('p-2 rounded hover:bg-gray-200', editor.isActive('bulletList') && 'bg-gray-300')}
            >
              <ListIcon size={16} />
            </button>

            <button
              type="button"
              title="Lista numerada"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={clsx('p-2 rounded hover:bg-gray-200', editor.isActive('orderedList') && 'bg-gray-300')}
            >
              <ListOrdered size={16} />
            </button>

            <button
              type="button"
              title="Citação"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={clsx('p-2 rounded hover:bg-gray-200', editor.isActive('blockquote') && 'bg-gray-300')}
            >
              <Quote size={16} />
            </button>

            <button
              type="button"
              title="Código"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={clsx('p-2 rounded hover:bg-gray-200', editor.isActive('code') && 'bg-gray-300')}
            >
              <Code size={16} />
            </button>

            {/* Linha horizontal */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="px-2 py-1 border rounded"
              title="Linha horizontal"
            >
              ―
            </button>

            {/* Quebra de linha */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setHardBreak().run()}
              className="px-2 py-1 border rounded"
              title="Quebra de linha (Shift+Enter)"
            >
              ⏎
            </button>

            {/* ---------------- Text Color Dropdown ---------------- */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setTextColorOpen((v) => !v)}
                className={`px-2 py-1 border rounded ${textColorOpen ? "bg-yellow-200" : ""}`}
                title="Cor do texto"
              >
                A<span className="ml-1" style={{ fontWeight: 700, color: editor.getAttributes("textStyle")?.color || "#000" }}>
                  ▾
                </span>
              </button>

              {textColorOpen && (
                <div className="absolute z-50 mt-2 p-2 bg-white border rounded shadow grid grid-rows-3 gap-2">
                  {COMMON_COLORS.map((c) => (
                    <Swatch key={c} color={c} onClick={applyTextColor} />
                  ))}
                  <button onClick={clearTextColor} className="col-span-6 px-3 py-3 border rounded text-sm">
                    Limpar cor
                  </button>
                </div>
              )}
            </div>

            {/* ---------------- Background Color Dropdown ---------------- */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setBgColorOpen((v) => !v)}
                className={`px-2 py-1 border rounded ${bgColorOpen ? "bg-yellow-200" : ""}`}
                title="Cor de fundo do texto"
              >
                Bg ▾
              </button>

              {bgColorOpen && (
                <div className="absolute z-50 mt-2 p-2 bg-white border rounded shadow grid grid-rows-3 gap-2">
                  {COMMON_COLORS.map((c) => (
                    <Swatch key={c} color={c} onClick={applyBgColor} />
                  ))}
                  <button onClick={clearBgColor} className="col-span-6 px-2 py-1 border rounded text-sm">
                    Limpar fundo
                  </button>
                </div>
              )}
            </div>

            {/* Linha horizontal */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="px-2 py-1 border rounded"
              title="Linha horizontal"
            >
              ―
            </button>

            {/* Quebra de linha */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setHardBreak().run()}
              className="px-2 py-1 border rounded"
              title="Quebra de linha (Shift+Enter)"
            >
              ⏎
            </button>

            <button type="button" title="Alinhar à esquerda" onClick={() => editor.chain().focus().setTextAlign('left').run()} className="p-2 rounded hover:bg-gray-200">
              <AlignLeft size={16} />
            </button>

            <button type="button" title="Centralizar" onClick={() => editor.chain().focus().setTextAlign('center').run()} className="p-2 rounded hover:bg-gray-200">
              <AlignCenter size={16} />
            </button>

            <button type="button" title="Alinhar à direita" onClick={() => editor.chain().focus().setTextAlign('right').run()} className="p-2 rounded hover:bg-gray-200">
              <AlignRight size={16} />
            </button>

            <button type="button" title="Inserir link" onClick={addLink} className="p-2 rounded hover:bg-gray-200">
              <LinkIcon size={16} />
            </button>

            <button type="button" title="Inserir imagem" onClick={addImage} className="p-2 rounded hover:bg-gray-200">
              <ImageIcon size={16} />
            </button>

            <div className="w-px h-5 bg-gray-300 mx-2" />

            <button type="button" title="Desfazer" onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded hover:bg-gray-200" disabled={!editor.can().undo()}>
              <Undo size={16} />
            </button>

            <button type="button" title="Refazer" onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded hover:bg-gray-200" disabled={!editor.can().redo()}>
              <Redo size={16} />
            </button>
          </>
        )}

        {/* HTML/CSS/JS toggle (sempre visível) */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">HTML/CSS/JS</span>
          <button
            type="button"
            onClick={handleToggleType}
            className={clsx('w-12 h-6 rounded-full transition flex items-center p-1', descriptionType === 'interactive' ? 'bg-blue-600' : 'bg-gray-300')}
            title={isRichText ? 'Alternar para HTML/CSS/JS' : 'Alternar para Rich Text'}
          >
            <div className={clsx('bg-white w-4 h-4 rounded-full shadow transform transition', descriptionType === 'interactive' ? 'translate-x-6' : 'translate-x-0')} />
          </button>
        </div>
      </div>

      {/* Área de edição */}
      {isRichText ? (
        // EditorContent com classes que garantem recuo e estilo de listas.
        // Se você usa @tailwindcss/typography, a classe "prose" já cuida bem disso.
        <EditorContent
          editor={editor}
          className="prose max-w-none min-h-[240px] border border-gray-300 rounded-md p-3
                     prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6"
        // adicione classes utilitárias para garantir recuo e estilo mesmo sem plugin typography
        /* style={{
          // fallback CSS caso o projeto não tenha o plugin typography ativo
          // garante que listas tenham recuo e marcadores
          // (pode ser removido se preferir usar suas classes globais)
          // eslint-disable-next-line react/no-unknown-property
          ['--tw-prose-body' as any]: undefined,
        }} */
        />
      ) : (
        <textarea
          value={value}
          onChange={handleInteractiveChange}
          className={clsx('w-full resize-y min-h-[240px] p-3 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono')}
          placeholder="Insira seu código HTML, CSS ou JavaScript interativo aqui..."
        />
      )}
    </div>
  )
}
