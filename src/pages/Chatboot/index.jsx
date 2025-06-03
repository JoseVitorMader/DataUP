import React, { useState } from "react";
import "./style.css"; 

const Chatboot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Pergunte algo sobre alimentação saudável." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Exemplo usando Hugging Face Inference API (gratuito para alguns modelos)
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTERAPIKEY}` // Coloque seu token da OpenRouter aqui
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // Ou outro modelo disponível na OpenRouter
          messages: [
            { role: "system", content: "Você é um especialista em alimentação saudável. Responda perguntas de forma clara e objetiva." },
            { role: "user", content: input }
          ]
        })
      });

      if (!response.ok) {
        setMessages((msgs) => [
          ...msgs,
          { sender: "bot", text: "O modelo de IA não está disponível. Por favor, tente novamente mais tarde ou consulte outro serviço." }
        ]);
      } else {
        const data = await response.json();
        const botText = data.choices?.[0]?.message?.content || "Desculpe, não entendi. Pode perguntar de outra forma?";
        setMessages((msgs) => [...msgs, { sender: "bot", text: botText }]);
      }
    } catch (e) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Erro ao conectar com a IA gratuita." }
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
        <br />
        <br />
        <br />
        <br />
        <br />
        
  <h2 className="chatbot-title">Chatbot de Alimentação</h2>
  <div className="chat-messages">
    {messages.map((msg, i) => (
      <div 
        key={i} 
        className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
      >
        {msg.text}
      </div>
    ))}
    {loading && <div className="typing-indicator">O bot está digitando...</div>}
  </div>
  <div className="chat-input-container">
    <input
      className="chat-input"
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={e => e.key === "Enter" && sendMessage()}
      placeholder="Digite sua pergunta..."
      disabled={loading}
    />
    <button 
      className="send-button"
      onClick={sendMessage} 
      disabled={loading || !input.trim()}
    >
      Enviar
    </button>
  </div>
</div>
  );
};

export default Chatboot;