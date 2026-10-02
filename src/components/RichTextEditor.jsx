import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Heading2 } from 'lucide-react'

export default function RichTextEditor({ content, onChange, editable = true }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Start typing here...',
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL (e.g., https://example.com/image.jpg)');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {editable && (
        <div className="flex items-center gap-1 p-2 border-b border-black/10 dark:border-white/10 flex-shrink-0 flex-wrap opacity-50 hover:opacity-100 transition-opacity">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Bold"><Bold size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Italic"><Italic size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Heading"><Heading2 size={18} /></button>
          <div className="w-px h-5 bg-black/20 dark:bg-white/20 mx-1"></div>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Bullet List"><List size={18} /></button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('orderedList') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Numbered List"><ListOrdered size={18} /></button>
          <div className="w-px h-5 bg-black/20 dark:bg-white/20 mx-1"></div>
          <button onClick={addImage} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors`} title="Add Image"><ImageIcon size={18} /></button>
        </div>
      )}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
        <EditorContent editor={editor} className="h-full min-h-[200px]" />
      </div>
    </div>
  )
}
