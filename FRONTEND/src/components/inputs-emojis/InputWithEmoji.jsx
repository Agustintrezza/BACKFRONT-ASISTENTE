import React, { useState, useRef, useEffect } from "react";
import { HiEmojiHappy } from "react-icons/hi";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function InputWithEmoji({
  value,
  onChange,
  placeholder = "",
  disabled = false,
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const ref = useRef(null);

  const handleEmojiSelect = (emoji) => {
    onChange(value + emoji.native);
    setShowEmoji(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full shadow-md rounded-md bg-white" ref={ref}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-violet-400 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
        className="absolute top-1/2 -translate-y-1/2 right-3 text-yellow-400 z-10"
        title="Insertar emoji"
      >
        <HiEmojiHappy size={20} />
      </button>
      {showEmoji && (
        <div className="absolute z-50 top-[105%] right-0">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
        </div>
      )}
    </div>
  );
}

export default InputWithEmoji;
