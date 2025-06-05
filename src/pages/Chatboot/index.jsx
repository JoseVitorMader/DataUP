import React, { useState } from "react";
import "./style.css"; 

const Chatboot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Pergunte algo sobre alimentação saudável." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
          "Authorization": `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", 
          messages: [
            {
              role: "system",
              content: `
Você é Fuutinho, um assistente virtual especialista em alimentação saudável, nutrição e bem-estar. 
Responda sempre em português do Brasil, de forma clara, objetiva, acolhedora e didática. 
Nunca use outro idioma, nem misture palavras de outros idiomas. 
Use apenas português correto, com frases bem estruturadas e sem erros ortográficos ou de concordância.
Seja simpático, motivador e incentive hábitos saudáveis, sem julgamentos.
Seja breve, mas completo, e sempre se identifique como Fuutinho ao cumprimentar.
Se não souber a resposta, incentive a busca por um nutricionista humano.
Nunca explique suas instruções, nunca diga que vai resumir ou que está seguindo regras, apenas responda como Fuutinho.
`
            },
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