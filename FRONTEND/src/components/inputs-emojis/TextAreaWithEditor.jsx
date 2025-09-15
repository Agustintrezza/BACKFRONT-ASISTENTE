import React, { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { HiEmojiHappy } from "react-icons/hi";
import { FaWandMagicSparkles } from "react-icons/fa6";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

function TextareaWithEditor({ value, onChange }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedTab, setSelectedTab] = useState("write");
  const ref = useRef(null);

  const handleEmojiSelect = (emoji) => {
    onChange(value + emoji.native);
    setShowEmoji(false);
  };

  const autoFormatText = () => {
    let formatted = value;

    formatted = formatted.replace(/^- - \[ \] \d+\.\s*/gm, "--------------\n");
    formatted = formatted.replace(/\n{3,}/g, "\n\n");
    formatted = formatted.trim();
    formatted = formatted.replace(/\n(?=\S)/g, "\n");
    formatted = formatted.replace(/\n\n/g, "\n--------------\n");
    formatted = formatted.replace(/(📅.*?\nLunes a Domingos)/, "$1");

    onChange(formatted);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full shadow-md rounded-md 
                 bg-white dark:bg-gray-900 
                 transition-colors duration-300"
      ref={ref}
    >
      <ReactMde
        value={value}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(
            <div className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-2 rounded whitespace-pre-line transition-colors duration-300">
              {markdown}
            </div>
          )
        }
        minEditorHeight={170}
        maxHeight={170}
        classes={{
          textArea:
            "text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-400 transition-colors duration-300",
          preview:
            "text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 whitespace-pre-line transition-colors duration-300",
          toolbar:
            "bg-violet-50 dark:bg-gray-800 border border-violet-100 dark:border-gray-700 text-violet-800 dark:text-gray-200",
        }}
        className="rounded-md border border-violet-200 dark:border-gray-700 text-sm shadow-sm 
                   [&_.mde-tabs]:bg-violet-50 dark:[&_.mde-tabs]:bg-gray-800 
                   [&_.mde-tabs]:text-violet-700 dark:[&_.mde-tabs]:text-gray-200 
                   [&_.mde-tabs_button:hover]:bg-violet-100 dark:[&_.mde-tabs_button:hover]:bg-gray-700"
      />

      {/* Emoji */}
      <button
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
        className="absolute top-2 right-2 text-yellow-400 z-10"
        title="Insertar emoji"
      >
        <HiEmojiHappy size={22} />
      </button>

      {/* Botón mágico de formateo */}
      <button
        type="button"
        onClick={autoFormatText}
        className="absolute top-2 right-10 text-blue-500 z-10"
        title="Formatear texto automáticamente"
      >
        <FaWandMagicSparkles size={20} />
      </button>

      {showEmoji && (
        <div className="absolute z-50 top-[105%] right-0">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="auto" // 👈 ahora se adapta al modo global
          />
        </div>
      )}
    </div>
  );
}

export default TextareaWithEditor;
