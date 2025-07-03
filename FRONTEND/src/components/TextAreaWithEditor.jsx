import React, { useState, useRef, useEffect } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { HiEmojiHappy } from 'react-icons/hi';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';

function TextareaWithEditor({ value, onChange }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedTab, setSelectedTab] = useState('write');
  const ref = useRef(null);

  const handleEmojiSelect = (emoji) => {
    onChange(value + emoji.native);
    setShowEmoji(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <ReactMde
        value={value}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(
            <div className="text-white bg-neutral-900 p-2 rounded">{markdown}</div>
          )
        }
        minEditorHeight={80}
        maxHeight={120}
        classes={{
          textArea: 'text-sm text-white bg-neutral-900 rounded-lg',
          preview: 'text-sm text-white bg-neutral-900',
          toolbar: 'text-sm bg-neutral-900 text-white border-neutral-700',
        }}
        className="rounded border border-neutral-700 text-sm [&_.mde-tabs]:bg-neutral-900 [&_.mde-tabs]:text-white [&_.mde-tabs button]:hover:bg-neutral-800"
      />

      <button
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
        className="absolute top-2 right-2 text-yellow-400 z-10"
      >
        <HiEmojiHappy size={22} />
      </button>

      {showEmoji && (
        <div className="absolute z-50 top-[105%] right-0">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}
    </div>
  );
}

export default TextareaWithEditor;
