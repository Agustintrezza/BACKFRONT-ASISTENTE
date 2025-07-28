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
    <div className="relative w-full shadow-md rounded-md bg-white" ref={ref}>
      <ReactMde
        value={value}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(
            <div className="text-gray-800 bg-white p-2 rounded">{markdown}</div>
          )
        }
        minEditorHeight={170}
        maxHeight={170}
        classes={{
          textArea: 'text-sm text-gray-800 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-violet-400',
          preview: 'text-sm text-gray-800 bg-white',
          toolbar: 'bg-violet-50 border border-violet-100 text-violet-800',
        }}
        className="rounded-md border border-violet-200 text-sm shadow-sm [&_.mde-tabs]:bg-violet-50 [&_.mde-tabs]:text-violet-700 [&_.mde-tabs button]:hover:bg-violet-100"
      />

      <button
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
        className="absolute top-2 right-2 text-yellow-400 z-10"
        title="Insertar emoji"
      >
        <HiEmojiHappy size={22} />
      </button>

      {showEmoji && (
        <div className="absolute z-50 top-[105%] right-0">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
        </div>
      )}
    </div>
  );
}

export default TextareaWithEditor;
