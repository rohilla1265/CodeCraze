import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../utils/axiosClient";
import { Send,Bot,User } from 'lucide-react';

function ChatAi({ problem, userCode = "", language = "javascript" }) {
    // 1. userCode aur language ko ya toh props se lein ya default value dein
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hi, How are you" }] },
        { role: 'user', parts: [{ text: "I am Good" }] }
    ]);

    // Hint state maintain karne ke liye taaki 1 se lekar 3 tak increment ho sake
    const [hintCount, setHintCount] = useState(1);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        const userMessage = { role: 'user', parts: [{ text: data.message }] };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        reset();

        try {
            // 2. Exact wahi payload bhejein jo backend ko chahiye aur jo Thunder Client mein chal gaya tha
            const response = await axiosClient.post("/ai/hint", {
                problemId: problem?._id,
                userCode: userCode,
                language: language,
                hintCount: hintCount,
                message: data.message,
                chatHistory: messages
            });

            if (response.data?.success) {
                setMessages(prev => [...prev, {
                    role: 'model',
                    parts: [{ text: response.data?.hint || "No hint found" }] // 3. Backend se 'hint' key aa rahi hai
                }]);

                // Agli baar ke liye hint level badhayein agar available ho
                if (response.data?.hasNextHint) {
                    setHintCount(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Error from AI Chatbot" }]
            }]);
        }
    };

    return (
    <div className="flex flex-col h-full min-h-[500px] w-full bg-base-100/80 backdrop-blur-md rounded-2xl border border-base-200/80 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-base-200/80 bg-base-200/40 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-base-content leading-tight">AI Hint Assistant</h3>
            <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages Area: overflow-y-auto ensure karta hai ki scrollbar sirf zaroorat padne par hi aae */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100/30">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              className={`chat ${isUser ? "chat-end" : "chat-start"}`}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isUser 
                    ? "bg-indigo-600 text-white" 
                    : "bg-base-300 text-base-content"
                }`}>
                  {isUser ? <User size={15} /> : <Bot size={15} />}
                </div>
              </div>

              {/* Chat Bubble */}
              <div className={`chat-bubble text-sm font-normal leading-relaxed rounded-2xl shadow-sm ${
                isUser 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-base-200 text-base-content rounded-tl-none border border-base-300/50"
              }`}>
                {msg.parts?.[0]?.text || ""}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-3 bg-base-100 border-t border-base-200 flex items-center gap-2 flex-shrink-0"
      >
        <div className="relative flex-1">
          <input
            placeholder="Ask for a hint..."
            className="input input-sm w-full bg-base-200/50 hover:bg-base-200 focus:bg-base-100 border-base-300 focus:border-indigo-500/50 focus:outline-none rounded-xl text-sm transition-all duration-200 pr-3 pl-3 py-4"
            {...register("message", { required: true })}
          />
        </div>

        <button
          type="submit"
          className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl px-4 min-h-[38px] h-[38px] flex items-center justify-center transition-all duration-200 shadow-md shadow-indigo-500/20 active:scale-95"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
    );
}

export default ChatAi;