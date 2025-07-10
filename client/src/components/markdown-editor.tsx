import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, Image, Code, Eye, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  isPreview?: boolean;
}

export function MarkdownEditor({ value, onChange, isPreview }: MarkdownEditorProps) {
  const [localPreview, setLocalPreview] = useState(false);
  const showPreview = isPreview || localPreview;

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const toolbarActions = [
    {
      icon: Bold,
      action: () => insertText("**", "**"),
      title: "Bold",
    },
    {
      icon: Italic,
      action: () => insertText("*", "*"),
      title: "Italic",
    },
    {
      icon: Link,
      action: () => insertText("[", "](url)"),
      title: "Link",
    },
    {
      icon: Image,
      action: () => insertText("![alt text](", ")"),
      title: "Image",
    },
    {
      icon: Code,
      action: () => insertText("`", "`"),
      title: "Code",
    },
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">
            {showPreview ? "Preview" : "Editor"}
          </h3>
          <div className="flex items-center space-x-2">
            {!isPreview && (
              <>
                {toolbarActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    title={action.title}
                    className="h-8 w-8 p-0"
                  >
                    <action.icon className="w-4 h-4" />
                  </Button>
                ))}
                <div className="w-px h-6 bg-gray-300 mx-2" />
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocalPreview(!localPreview)}
              className="flex items-center space-x-1"
            >
              {localPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{localPreview ? "Edit" : "Preview"}</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {showPreview ? (
          <div className="prose prose-lg max-w-none min-h-96">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mt-5 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-slate-700 mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-slate-700">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-slate-700">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children }) => (
                  <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-slate-600 mb-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {value || "Nothing to preview..."}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea
            id="markdown-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your post content in Markdown..."
            className="min-h-96 font-mono text-sm resize-none border-none shadow-none focus-visible:ring-0"
          />
        )}
      </div>
    </div>
  );
}
