'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button } from '@myinsurancebuddy/ui';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, List, ListOrdered } from 'lucide-react';
import { useEffect } from 'react';

interface EditorProps {
    value: string;
    onChange: (html: string) => void;
}

export default function TipTapEditor({ value, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Image,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 border rounded-md',
            },
        },
    });

    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('Image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Link URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border rounded-md bg-white">
            <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 items-center">
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-200' : ''} type="button">
                    <Bold className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-200' : ''} type="button">
                    <Italic className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''} type="button">
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''} type="button">
                    <Heading2 className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200' : ''} type="button">
                    <List className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-200' : ''} type="button">
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button size="sm" variant="ghost" onClick={setLink} className={editor.isActive('link') ? 'bg-gray-200' : ''} type="button">
                    <LinkIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={addImage} type="button">
                    <ImageIcon className="w-4 h-4" />
                </Button>
            </div>
            <div className="editor-container max-w-none">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
