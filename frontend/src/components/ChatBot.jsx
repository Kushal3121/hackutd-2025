import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { handleAction, applyFilters } from '../utils/chatActions';
import CarCard from './CarCard';
import { useGarageStore } from '../store/garageStore';

export default function ChatBot({ cars = [] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I am the AI Assistant. Ask me to search, compare or recommend cars.',
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);
  const addToGarage = useGarageStore((s) => s.add);

  const latestCars = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setThinking(true);
    // simulate brief thinking
    setTimeout(async () => {
      const reply = await handleAction(text, latestCars, { addToGarage });
      setThinking(false);
      if (reply?.type === 'search') {
        // Show "searching..." then compute results locally
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content: { type: 'text', message: reply.message || 'Searching…' },
          },
        ]);
        setTimeout(() => {
          const results = applyFilters(latestCars, reply.filters || {});
          if (!results.length) {
            setMessages((m) => [
              ...m,
              {
                role: 'assistant',
                content: {
                  type: 'text',
                  message:
                    'No matches found. Try relaxing your filters or changing the region.',
                },
              },
            ]);
          } else {
            setMessages((m) => [
              ...m,
              {
                role: 'assistant',
                content: {
                  type: 'cars',
                  message: `Found ${results.length} match(es). Showing top results:`,
                  cars: results.slice(0, 3),
                },
              },
            ]);
          }
        }, 350);
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      }
    }, 300);
  };

  const renderMessage = (msg, idx) => {
    if (msg.role === 'assistant' && typeof msg.content === 'object') {
      const { type, message, cars: carList = [] } = msg.content;
      return (
        <div key={idx} className='w-full'>
          <ChatMessage role='assistant'>{message}</ChatMessage>
          {type === 'cars' && carList.length > 0 && (
            <div className='grid gap-3 grid-cols-1 mt-2'>
              {carList.map((c) => (
                <CarCard key={`chat-${c.id}`} car={c} />
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <ChatMessage key={idx} role={msg.role}>
        {typeof msg.content === 'string' ? msg.content : ''}
      </ChatMessage>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        aria-label='Open Toyota AI Assistant'
        onClick={() => setOpen((v) => !v)}
        className='fixed bottom-6 right-6 z-50 rounded-full bg-[#EB0A1E] text-white w-14 h-14 shadow-lg hover:bg-red-600 transition flex items-center justify-center'
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {/* Overlay + Chat Panel */}
      {open && (
        <div className='fixed inset-0 z-40'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            onClick={() => setOpen(false)}
            aria-hidden='true'
          />
          {/* Panel */}
          <div
            className='absolute bottom-10 right-10 w-[720px] max-w-[96vw] bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/60 overflow-hidden transition-all duration-300'
            role='dialog'
            aria-label='AI Assistant'
          >
            {/* Header */}
            <div className='px-5 py-4 border-b border-gray-200 bg-white flex items-start justify-between'>
              <div>
                <div className='font-semibold text-gray-900'>AI Assistant</div>
                <div className='text-xs text-gray-500'>
                  Local, private, and fast
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className='text-gray-500 hover:text-gray-700 transition'
                aria-label='Close assistant'
              >
                <X size={18} />
              </button>
            </div>

            {/* Body: messages + input, uses fixed height for stable layout */}
            <div className='flex flex-col h-[72vh] bg-[#F9FAFB]'>
              {/* Messages */}
              <div ref={scrollRef} className='flex-1 overflow-y-auto p-4'>
                {messages.map((m, i) => renderMessage(m, i))}
                {thinking && (
                  <ChatMessage role='assistant'>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <span className='sr-only'>Assistant is typing…</span>
                      <span className='w-2 h-2 rounded-full bg-[#EB0A1E] animate-bounce' />
                      <span className='w-2 h-2 rounded-full bg-[#EB0A1E] animate-bounce [animation-delay:120ms]' />
                      <span className='w-2 h-2 rounded-full bg-[#EB0A1E] animate-bounce [animation-delay:240ms]' />
                    </div>
                  </ChatMessage>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className='p-4 bg-white border-t border-gray-200'
              >
                <div className='flex items-center gap-2'>
                  <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Ask me e.g. "compare camry and corolla"'
                    className='flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]'
                  />
                  <button
                    type='submit'
                    className='inline-flex items-center gap-1 px-3 py-2 bg-[#EB0A1E] text-white rounded-md hover:bg-red-600 transition'
                  >
                    <Send size={16} /> Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
