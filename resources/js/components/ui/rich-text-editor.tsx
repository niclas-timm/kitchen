import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    BoldIcon,
    Heading2Icon,
    Heading3Icon,
    ItalicIcon,
    ListIcon,
    ListOrderedIcon,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { Button } from './button';

interface RichTextEditorProps {
    name?: string;
    defaultValue?: string;
    placeholder?: string;
    required?: boolean;
    onChange?: (html: string) => void;
}

export function RichTextEditor({
    name,
    defaultValue = '',
    placeholder,
    required,
    onChange,
}: RichTextEditorProps) {
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
        ],
        content: defaultValue,
        editorProps: {
            attributes: {
                class: 'prose prose-sm  max-w-none min-h-[120px] px-3 py-2 focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (hiddenInputRef.current) {
                hiddenInputRef.current.value = html;
            }
            onChange?.(html);
        },
    });

    useEffect(() => {
        if (hiddenInputRef.current) {
            hiddenInputRef.current.value = defaultValue;
        }
    }, [defaultValue]);

    if (!editor) {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <div className="flex flex-wrap gap-1 border-b border-input bg-muted/30 p-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('bold') && 'bg-sage-100 '
                    )}
                    title="Bold (Ctrl+B)"
                >
                    <BoldIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('italic') && 'bg-sage-100 '
                    )}
                    title="Italic (Ctrl+I)"
                >
                    <ItalicIcon className="h-4 w-4" />
                </Button>
                <div className="mx-1 w-px bg-border" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('heading', { level: 2 }) &&
                            'bg-sage-100 '
                    )}
                    title="Heading 2"
                >
                    <Heading2Icon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('heading', { level: 3 }) &&
                            'bg-sage-100 '
                    )}
                    title="Heading 3"
                >
                    <Heading3Icon className="h-4 w-4" />
                </Button>
                <div className="mx-1 w-px bg-border" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('bulletList') && 'bg-sage-100 '
                    )}
                    title="Bullet List"
                >
                    <ListIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        'h-8 w-8 p-0',
                        editor.isActive('orderedList') && 'bg-sage-100 '
                    )}
                    title="Numbered List"
                >
                    <ListOrderedIcon className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent
                editor={editor}
                className="text-sm [&_.tiptap]:min-h-[120px]"
            />
            {placeholder && editor.isEmpty && (
                <div className="pointer-events-none absolute top-[52px] left-3 text-sm text-muted-foreground">
                    {placeholder}
                </div>
            )}
            <input
                ref={hiddenInputRef}
                type="hidden"
                name={name}
                defaultValue={defaultValue}
                required={required}
            />
        </div>
    );
}
