import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiArrowLeft } from 'react-icons/hi';
import { Button } from 'flowbite-react';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { from: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');

    try {
      const res = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
        sender: 'frontend-user',
        message: userInput,
      });

      const botReplies = res.data.map((msg) => ({
        from: 'bot',
        text: msg.text || '',
        buttons: msg.buttons || [],
      }));

      setMessages([...newMessages, ...botReplies]);
    } catch (err) {
      console.error('Error enviando mensaje a Rasa:', err);
      setMessages([
        ...newMessages,
        { from: 'bot', text: '⚠️ No se pudo comunicar con el asistente.', buttons: [] },
      ]);
    }
  };

  const sendMessageWithPayload = async (payload) => {
    const newMessages = [...messages, { from: 'user', text: payload }];
    setMessages(newMessages);

    try {
      const res = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
        sender: 'frontend-user',
        message: payload,
      });

      const botReplies = res.data.map((msg) => ({
        from: 'bot',
        text: msg.text || '',
        buttons: msg.buttons || [],
      }));

      setMessages([...newMessages, ...botReplies]);
    } catch (err) {
      console.error('Error enviando mensaje a Rasa:', err);
      setMessages([
        ...newMessages,
        { from: 'bot', text: '⚠️ No se pudo comunicar con el asistente.', buttons: [] },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <div className="min-h-screen p-4 bg-black text-white">
      {/* Encabezado con botón Volver */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span className="text-5xl">🤖</span>
          Conversá con tu Asistente Virtual
        </h1>
        <Button
          onClick={() => navigate('/productos')}
          className="flex items-center buttom-custom-yellow font-medium px-4 py-2"
        >
          <HiArrowLeft size={20} className="mr-2 self-center" />
          Volver
        </Button>
      </div>

      {/* Contenedor de conversación */}
      <div className="bg-neutral-900 rounded-lg p-4 overflow-y-auto space-y-2 h-[65vh] w-full max-w-6xl mx-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-2 rounded-lg whitespace-pre-wrap ${
              msg.from === 'user'
                ? 'self-end text-black text-right ml-auto'
                : 'bg-gray-700 self-start text-left mr-auto'
            }`}
            style={msg.from === 'user' ? { backgroundColor: '#ffd700' } : {}}
          >
            {msg.text.split('\n').map((line, idx) => (
              <p key={idx} className="mb-[-3px]">{line}</p>
            ))}

            {/* Botones del asistente si existen */}
            {msg.buttons && msg.buttons.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {msg.buttons.map((btn, j) =>
                  btn.type === 'web_url' && btn.url ? (
                    <a
                      key={j}
                      href={btn.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600 text-sm inline-block"
                    >
                      {btn.title}
                    </a>
                  ) : (
                    <button
                      key={j}
                      onClick={() => {
                        setUserInput('');
                        sendMessageWithPayload(btn.payload);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600 text-sm"
                    >
                      {btn.title}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} className="pt-6" />
      </div>

      {/* Input y botón Enviar */}
      <div className="mt-4 flex gap-2 w-full max-w-6xl mx-auto">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí tu mensaje..."
          className="flex-1 px-4 py-2 input-bg rounded bg-neutral-800 border border-neutral-700 text-white"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
