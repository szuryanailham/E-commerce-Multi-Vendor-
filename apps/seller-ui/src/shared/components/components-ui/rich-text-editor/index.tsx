'use client';

import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onContentChange,
  placeholder = 'Mulai menulis di sini...',
  height = '280px',
}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'align',
    'link',
    'image',
  ];

  return (
    <div className="dark-editor">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onContentChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="rounded-md"
        style={{ height, marginBottom: '70px' }}
      />

      {/* Dark mode styling */}
      <style jsx>{`
        .dark-editor .ql-toolbar {
          background-color: #111827;
          border: 1px solid #374151;
        }

        .dark-editor .ql-container {
          background-color: #020617;
          border: 1px solid #374151;
          color: #f9fafb;
        }

        .dark-editor .ql-editor {
          color: #f9fafb;
          min-height: ${height};
        }

        .dark-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
        }

        /* Toolbar icons */
        .dark-editor .ql-snow .ql-stroke {
          stroke: #e5e7eb;
        }

        .dark-editor .ql-snow .ql-fill {
          fill: #e5e7eb;
        }

        .dark-editor .ql-snow .ql-picker-label {
          color: #e5e7eb;
        }

        .dark-editor .ql-snow .ql-picker-options {
          background-color: #111827;
          border: 1px solid #374151;
        }

        .dark-editor .ql-snow .ql-picker-item {
          color: #e5e7eb;
        }

        .dark-editor .ql-snow .ql-picker-item:hover {
          background-color: #1f2937;
        }

        /* Hover & active */
        .dark-editor .ql-toolbar button:hover,
        .dark-editor .ql-toolbar button.ql-active {
          background-color: #1f2937;
        }

        .dark-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #60a5fa;
        }

        .dark-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
