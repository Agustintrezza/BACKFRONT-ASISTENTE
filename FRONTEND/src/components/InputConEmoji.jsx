import React, { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { HiEmojiHappy } from "react-icons/hi";

function InputConEmoji({ label, value, onChange, isTextarea = false }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    onChange(value + emoji.native);
  };

  return (
    <div className="relative">
      <label className="block mb-1 text-sm text-gray-300">{label}</label>

      <div className="flex items-start">
        {isTextarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
            className="w-full p-3 rounded text-white placeholder-gray-400 bg-neutral-900 outline-none input-bg resize-none"
            placeholder={`Escribí ${label.toLowerCase()}`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 rounded text-white placeholder-gray-400 bg-neutral-900 outline-none input-bg"
            placeholder={`Escribí ${label.toLowerCase()}`}
          />
        )}

        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="ml-2 mt-1 text-yellow-400 hover:text-yellow-300"
        >
          <HiEmojiHappy size={24} />
        </button>
      </div>

      {showPicker && (
        <div className="absolute z-50 mt-2">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}
    </div>
  );
}

export default InputConEmoji;
