'use client'

import { useEffect, useState, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import clsx from 'clsx'

import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
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
  Palette,
} from 'lucide-react'

type DescriptionEditorProps = {
  value: string
  onChange: (value: string) => void
  descriptionType: 'richtext' | 'interactive'
  onSetDescriptionType: (value: 'richtext' | 'interactive') => void
}

export default function DescriptionEditor({
  value,
  onChange,
  descriptionType,
  onSetDescriptionType
}: DescriptionEditorProps) {
  const [color, setColor] = useState('#000000')

  const isRichText = descriptionType === 'richtext'

  const extensions = useMemo(() => [
    StarterKit,
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
    TextStyle, Color,
  ], [])

  const editor = useEditor({
    extensions: extensions,
    content: isRichText ? value || '' : '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none'
      }
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (isRichText) {
        onChange(editor.getHTML())
      }
    }
  }, [isRichText]) // Dependência isRichText garante re-inicialização do editor

  useEffect(() => {
    if (editor && isRichText && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false }) // false para não disparar um evento onUpdate desnecessário

    }
  }, [value, editor, isRichText])

  // Função que invoca handleToggleType e alterna entre os modos
  const handleToggleType = () => {
    if (isRichText) {
      const confirmChange = confirm(
        'Alternar para o modo HTML/CSS/JS interativo limpará o conteúdo atual do Rich Text. Deseja continuar?'
      )
      if (!confirmChange) return

      // Envia o novo tipo para o componente pai
      onSetDescriptionType('interactive')

      // Limpa o conteúdo do editor Tiptap e o valor
      editor?.commands.clearContent()
      onChange('')

      alert('Modo interativo (HTML/CSS/JS) ativado. Insira seu código manualmente.')
    } else {
      // Envia o novo tipo para o componente pai
      onSetDescriptionType('richtext')
    }
  }

  // Comandos de formatação... (omissos para brevidade, mas presentes no arquivo final)
  const setTextColor = () => {
    if (!editor) return
    const chosen = prompt('Digite uma cor (nome, #hex ou rgb):', color)
    if (chosen) {
      setColor(chosen)
      editor.chain().focus().setColor(chosen).run()
    }
  }

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
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      {/* Toolbar Container */}
      <div className="flex flex-wrap gap-1 mb-3 items-center">
        {/* Botões de Formatação - Apenas no modo Rich Text */}
        {isRichText && editor && (
          <>
            {/* ... Todos os botões do Rich Text ... */}
            <button
              type="button"
              title="Negrito"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                editor.isActive('bold') && 'bg-gray-300'
              )}
            >
              <Bold size={16} />
            </button>
            {/* Outros botões de formatação (Itálico, Sublinhado, etc.) */}
            <button
              type="button"
              title="Itálico"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                editor.isActive('italic') && 'bg-gray-300'
              )}
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              title="Sublinhado"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                editor.isActive('underline') && 'bg-gray-300'
              )}
            >
              <UnderlineIcon size={16} />
            </button>
            <button
              type="button"
              title="Riscado"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                editor.isActive('strike') && 'bg-gray-300'
              )}
            >
              <Strikethrough size={16} />
            </button>
            <button
              type="button"
              title="Lista com marcadores"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                editor.isActive('bulletList') && 'bg-gray-300'
              )}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              title="Lista numerada"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                editor.isActive('orderedList') && 'bg-gray-300'
              )}
            >
              <ListOrdered size={16} />
            </button>
            <button
              type="button"
              title="Citação"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                editor.isActive('blockquote') && 'bg-gray-300'
              )}
            >
              <Quote size={16} />
            </button>
            <button
              type="button"
              title="Código"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={clsx(
                'p-2 rounded hover:bg-gray-200',
                editor.isActive('code') && 'bg-gray-300'
              )}
            >
              <Code size={16} />
            </button>
            <button
              type="button"
              title="Cor do texto"
              onClick={setTextColor}
              className="p-2 rounded hover:bg-gray-200"
            >
              <Palette size={16} />
            </button>
            <button
              type="button"
              title="Alinhar à esquerda"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className="p-2 rounded hover:bg-gray-200"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              title="Centralizar"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className="p-2 rounded hover:bg-gray-200"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              title="Alinhar à direita"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className="p-2 rounded hover:bg-gray-200"
            >
              <AlignRight size={16} />
            </button>
            <button
              type="button"
              title="Inserir link"
              onClick={addLink}
              className="p-2 rounded hover:bg-gray-200"
            >
              <LinkIcon size={16} />
            </button>
            <button
              type="button"
              title="Inserir imagem"
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-200"
            >
              <ImageIcon size={16} />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-2" />
            <button
              type="button"
              title="Desfazer"
              onClick={() => editor.chain().focus().undo().run()}
              className="p-2 rounded hover:bg-gray-200"
              disabled={!editor.can().undo()}
            >
              <Undo size={16} />
            </button>
            <button
              type="button"
              title="Refazer"
              onClick={() => editor.chain().focus().redo().run()}
              className="p-2 rounded hover:bg-gray-200"
              disabled={!editor.can().redo()}
            >
              <Redo size={16} />
            </button>
          </>
        )}

        {/* Botão HTML/CSS/JS (sempre visível, canto direito) */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">HTML/CSS/JS</span>
          <button
            type="button"
            onClick={handleToggleType}
            className={clsx(
              'w-12 h-6 rounded-full transition flex items-center p-1',
              descriptionType === 'interactive' ? 'bg-blue-600' : 'bg-gray-300'
            )}
            title={isRichText ? 'Alternar para HTML/CSS/JS' : 'Alternar para Rich Text'}
          >
            <div
              className={clsx(
                'bg-white w-4 h-4 rounded-full shadow transform transition',
                descriptionType === 'interactive'
                  ? 'translate-x-6'
                  : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </div>

      {/* Área de edição - Condicional */}
      {isRichText ? (
        // Modo Rich Text (Tiptap)
        <EditorContent
          editor={editor}
          className="min-h-[240px] border border-gray-300 rounded-md p-3"
        />
      ) : (
        // Modo Interactive (Textarea)
        <textarea
          value={value}
          onChange={handleInteractiveChange}
          className={clsx(
            'w-full resize-y min-h-[240px] p-3 border border-gray-300 rounded-md',
            'bg-gray-50 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500',
            'font-mono' // Fonte monospaced
          )}
          placeholder="Insira seu código HTML, CSS ou JavaScript interativo aqui..."
        />
      )}
    </div>
  )
}