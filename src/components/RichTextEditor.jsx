import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Heading2, FileCode2, Table as TableIcon, CheckSquare, Maximize, Minimize, PenTool, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { getModalClasses } from '../utils/themeConfig'

import { Mark, mergeAttributes } from '@tiptap/core'

// Configure Turndown to preserve tables, images, and styled spans as HTML
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
})
turndownService.use(gfm)
turndownService.keep(['table', 'tr', 'td', 'th', 'tbody', 'thead', 'hr'])

turndownService.addRule('keepImg', {
  filter: 'img',
  replacement: function (content, node) {
    return node.outerHTML;
  }
});

turndownService.addRule('keepSpan', {
  filter: 'span',
  replacement: function (content, node) {
    return node.outerHTML;
  }
});

// Create a custom FontSize Mark extension
const FontSize = Mark.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] } },
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
        renderHTML: attributes => {
          if (!attributes.size) return {}
          return { style: `font-size: ${attributes.size}` }
        },
      },
    }
  },
  parseHTML() { return [{ tag: 'span[style*=font-size]' }] },
  renderHTML({ HTMLAttributes }) { return ['span', mergeAttributes(HTMLAttributes), 0] },
  addCommands() {
    return {
      setFontSize: size => ({ chain }) => chain().setMark('fontSize', { size }).run(),
      unsetFontSize: () => ({ chain }) => chain().unsetMark('fontSize').run(),
    }
  },
})

// Extend Image to support width and height attributes
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: element => {
          let src = element.getAttribute('src');
          // Fix AI hallucinations where it inserts markdown links inside src="..."
          if (src && src.startsWith('[') && src.includes('](')) {
            const match = src.match(/\]\((.*?)\)/);
            if (match) src = match[1];
          }
          return src;
        },
        renderHTML: attributes => {
          if (!attributes.src) return {}
          return { src: attributes.src }
        },
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => {
          if (!attributes.alt) return {}
          return { alt: attributes.alt }
        },
      },
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        },
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {}
          return { style: attributes.style }
        },
      }
    }
  },
})

// Extend TableCell to support styling attributes
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      valign: {
        default: null,
        parseHTML: element => element.getAttribute('valign'),
        renderHTML: attributes => {
          if (!attributes.valign) return {}
          return { valign: attributes.valign }
        },
      },
      colspan: {
        default: 1,
        parseHTML: element => element.getAttribute('colspan') || 1,
        renderHTML: attributes => {
          if (!attributes.colspan || attributes.colspan === 1) return {}
          return { colspan: attributes.colspan }
        }
      }
    }
  },
})

export default function RichTextEditor({ content, onChange, editable = true, theme = 'aesthetic' }) {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownText, setMarkdownText] = useState("");
  const [imagePrompt, setImagePrompt] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(theme !== 'sky');

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      FontSize,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      CustomTableCell,
      Placeholder.configure({
        placeholder: 'Start typing here...',
      }),
    ],
    // If the content comes from API as raw markdown (no HTML tags like <p>), parse it using marked
    content: (content && !content.includes('<p>') && !content.includes('<h')) ? marked.parse(content, { async: false }) : content,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toggleMarkdownMode = () => {
    if (!isMarkdownMode) {
      const html = editor.getHTML();
      setMarkdownText(turndownService.turndown(html));
    } else {
      // Ensure marked doesn't sanitize the HTML tags
      const parsedHtml = marked.parse(markdownText, { async: false });
      editor.commands.setContent(parsedHtml);
      onChange(editor.getHTML());
    }
    setIsMarkdownMode(!isMarkdownMode);
  };

  const handleImageSubmit = () => {
    if (imagePrompt.isMarkdownMode) {
      if (imageUrl) {
        const imgTag = imageWidth ? `<img src="${imageUrl}" width="${imageWidth}" />` : `![](${imageUrl})`;
        setMarkdownText(prev => prev + '\n' + imgTag + '\n');
      }
    } else {
      if (imageUrl) {
        if (imageWidth) {
          editor.chain().focus().setImage({ src: imageUrl, width: imageWidth }).run();
        } else {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      }
    }
    setImagePrompt(null);
    setImageUrl("");
    setImageWidth("");
  };

  const addImage = () => {
    setImagePrompt({ isMarkdownMode });
  };

  const handleIncreaseFontSize = () => {
    const currentSize = editor.getAttributes('fontSize').size || '18px';
    const currentPx = parseInt(currentSize, 10);
    const newSize = `${currentPx + 2}px`;
    editor.chain().focus().setFontSize(newSize).run();
  };

  const handleDecreaseFontSize = () => {
    const currentSize = editor.getAttributes('fontSize').size || '18px';
    const currentPx = parseInt(currentSize, 10);
    const newSize = `${Math.max(10, currentPx - 2)}px`;
    editor.chain().focus().setFontSize(newSize).run();
  };

  const modalClasses = getModalClasses(theme);

  return (
    <div className="flex flex-col h-full w-full">
      {editable && (
        <div className={`flex items-center gap-1 p-2 flex-shrink-0 flex-wrap transition-opacity ${theme === 'sky' ? 'border-b border-white/20 pb-4 text-white opacity-80 hover:opacity-100 drop-shadow' : 'border-b border-black/10 dark:border-white/10 opacity-50 hover:opacity-100'}`}>
          <button 
            onClick={() => setShowToolbar(!showToolbar)} 
            className={`p-1.5 rounded transition-all flex items-center gap-2 font-bold ${showToolbar ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/10 dark:hover:bg-white/10'}`} 
            title="Toggle Toolbar"
          >
            {showToolbar ? <X size={18} /> : <PenTool size={18} />}
            {!showToolbar && <span className="text-sm opacity-80 uppercase tracking-widest">tools</span>}
          </button>
          
          {showToolbar && (
            <>
              <div className="w-px h-5 bg-black/20 dark:bg-white/20 mx-1"></div>
              {!isMarkdownMode && (
                <>
                  <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Bold"><Bold size={18} /></button>
                  <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Italic"><Italic size={18} /></button>
                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Heading"><Heading2 size={18} /></button>
                  <div className="w-px h-5 bg-black/20 dark:bg-white/20 mx-1"></div>
                  <button onClick={handleDecreaseFontSize} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors font-bold text-sm`} title="Decrease Font Size">A-</button>
                  <button onClick={handleIncreaseFontSize} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors font-bold text-sm`} title="Increase Font Size">A+</button>
                  <div className="w-px h-5 bg-black/20 dark:bg-white/20 mx-1"></div>
                  <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('taskList') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Checklist"><CheckSquare size={18} /></button>
                  <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Bullet List"><List size={18} /></button>
                  <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${editor.isActive('orderedList') ? 'bg-black/20 dark:bg-white/20' : ''}`} title="Numbered List"><ListOrdered size={18} /></button>
                  <div className="w-px h-5 bg-black/20 dark:bg-white/20 mx-1"></div>
                  <button onClick={addImage} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors`} title="Add Image"><ImageIcon size={18} /></button>
                  <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors`} title="Insert Table"><TableIcon size={18} /></button>
                </>
              )}
              
              {isMarkdownMode && <div className="ml-2 text-sm font-bold opacity-60 tracking-wider">MARKDOWN EDIT</div>}
              <div className="flex-grow"></div>
              <button onClick={toggleFullscreen} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors mr-1`} title="Toggle Fullscreen">
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
              <button onClick={toggleMarkdownMode} className={`p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${isMarkdownMode ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`} title="Toggle Markdown View"><FileCode2 size={18} /></button>
            </>
          )}
        </div>
      )}
      <div className={`flex-grow p-2 ${editable ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden pointer-events-none mask-bottom'}`}>
        {isMarkdownMode ? (
          <textarea
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
            className={`w-full h-full min-h-[300px] bg-transparent outline-none resize-none font-mono text-lg ${theme === 'sky' ? 'text-white' : ''}`}
            placeholder="Write markdown here..."
            disabled={!editable}
          />
        ) : (
          <EditorContent 
            editor={editor} 
            className="h-full min-h-[200px] prose prose-lg dark:prose-invert max-w-none focus:outline-none prose-p:font-medium prose-headings:font-black prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-current prose-table:table-auto prose-td:align-top opacity-90" 
          />
        )}
      </div>

      {/* Image Prompt Modal */}
      {imagePrompt && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200 ${modalClasses.overlay}`}>
          <div className={`m-4 max-w-sm w-full transform transition-all scale-in-100 ${modalClasses.container}`}>
            <h2 className={`${modalClasses.title}`}>Insert Image</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold opacity-70 mb-2">Image URL</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  className={`${modalClasses.input}`}
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold opacity-70 mb-2">Width (Optional)</label>
                <input 
                  type="text" 
                  value={imageWidth} 
                  onChange={(e) => setImageWidth(e.target.value)} 
                  className={`${modalClasses.input}`}
                  placeholder="e.g. 300, 50%, or 800px"
                  onKeyDown={(e) => e.key === 'Enter' && handleImageSubmit()}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setImagePrompt(null); setImageUrl(""); setImageWidth(""); }}
                className={`${modalClasses.buttonCancel}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleImageSubmit}
                className={`${modalClasses.buttonSubmit}`}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
