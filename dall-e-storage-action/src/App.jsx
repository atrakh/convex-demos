import { useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const messages = useQuery(api.listMessages.default) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.sendMessage.default);
  const [sending, setSending] = useState(false);
  const sendDallE = useAction(api.actions.sendDallE.default);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendMessage(event) {
    event.preventDefault();
    if (
      newMessageText.startsWith("/dalle ") ||
      newMessageText.startsWith("/dall-e ")
    ) {
      const prompt = newMessageText.split(" ").slice(1).join(" ");
      setSending(true);
      try {
        await sendDallE({ prompt, author: name });
      } finally {
        setSending(false);
      }
    } else {
      await sendMessage({ body: newMessageText, author: name, format: "text" });
    }
    setNewMessageText("");
  }
  return (
    <main>
      <h1>Convex Chat</h1>
      <p className="badge">
        <span>{name}</span>
      </p>
      <div className="instructions">
        To send a Dall-E image, use <span>/dall-e prompt</span>
      </div>
      <ul>
        {messages.map(message => (
          <li key={message._id.toString()}>
            <span>{message.author}:</span>
            {message.format === "dall-e" ? (
              <figure>
                <img title={message.prompt} src={message.body} />
                <div className="dall-e-attribution">
                  Powered by Dall-E (OpenAI)
                </div>
              </figure>
            ) : (
              <span>{message.body}</span>
            )}
            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
          </li>
        ))}
        {sending && (
          <li key="loading">
            <div className="lds-dual-ring"></div>
          </li>
        )}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          value={newMessageText}
          onChange={event => setNewMessageText(event.target.value)}
          placeholder="Write a message…"
        />
        <input type="submit" value="Send" disabled={!newMessageText} />
      </form>
    </main>
  );
}
