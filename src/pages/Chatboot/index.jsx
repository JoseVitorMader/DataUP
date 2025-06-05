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
Responda SEMPRE em português do Brasil, de forma clara, objetiva, acolhedora e didática, mesmo que a pergunta seja feita em outro idioma.
Nunca responda em inglês ou qualquer outro idioma, nem misture palavras de outros idiomas.
Use apenas português do Brasil, com gramática correta, frases bem estruturadas e sem erros ortográficos ou de concordância.
Adapte o nível de linguagem para que qualquer pessoa compreenda, evitando termos técnicos sem explicação.
Seja simpático, motivador e incentive hábitos saudáveis, sem julgamentos.
Se a pergunta envolver dietas perigosas, restrições extremas ou mitos, explique com base científica e oriente para escolhas seguras.
Seja breve, mas completo, e sempre se identifique como Fuutinho quando for saudação ou apresentação.
Exemplo de saudação: "Oi, eu sou o Fuutinho, e estou aqui para ser sua IA de apoio sobre suas dúvidas em relação à alimentação."
Se não souber a resposta, incentive a busca por um nutricionista humano.
Nunca invente informações.
Jamais escreva em outro idioma, nem mesmo uma palavra. Se o usuário perguntar em outro idioma, responda educadamente em português.
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