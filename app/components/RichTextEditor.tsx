'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/core'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
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
  Code2,
  Wand2,
} from 'lucide-react'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  descriptionType: 'richtext' | 'interactive'
  onSetDescriptionType: (value: 'richtext' | 'interactive') => void
}

export default function RichTextEditor({
  value,
  onChange,
  descriptionType,
  onSetDescriptionType
}: RichTextEditorProps) {
  const [color, setColor] = useState('#000000')

  const editor = useEditor({
    extensions: [
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
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  // altera tipo com confirmação
  const handleToggleType = () => {
    if (descriptionType === 'richtext') {
      const confirmChange = confirm(
        'Alternar para o modo HTML interativo limpará o conteúdo atual. Deseja continuar?'
      )
      if (!confirmChange) return
      onSetDescriptionType('interactive')
      editor.commands.clearContent()
      alert('Modo interativo ativado. Insira seu HTML manualmente.')
    } else {
      onSetDescriptionType('richtext')
    }
  }

  const setTextColor = () => {
    const chosen = prompt('Digite uma cor (nome, #hex ou rgb):', color)
    if (chosen) {
      setColor(chosen)
      editor.chain().focus().setColor(chosen).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('URL:')
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = () => {
    const src = window.prompt('URL da imagem:')
    if (src) editor.chain().focus().setImage({ src }).run()
  }

  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-3 items-center">
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
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          title="Refazer"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200"
        >
          <Redo size={16} />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">HTML</span>
          <button
            type="button"
            onClick={handleToggleType}
            className={clsx(
              'w-12 h-6 rounded-full transition flex items-center p-1',
              descriptionType === 'interactive' ? 'bg-blue-600' : 'bg-gray-300'
            )}
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

      {/* Área de edição */}
      <EditorContent editor={editor} className="prose max-w-none min-h-[240px]" />
    </div>
  )
}
