import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const messages = useQuery(api.listMessages.default) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.sendMessage.default);
  const sendExpiringMessage = useMutation(api.sendExpiringMessage.default);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendMessage(event) {
    event.preventDefault();
    if (newMessageText.startsWith("/expiring ")) {
      await sendExpiringMessage({
        body: newMessageText.slice(10),
        author: name,
      });
    } else {
      await sendMessage({ body: newMessageText, author: name });
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
        To send a self-destructing message, use <span>/expiring message</span>
      </div>
      <ul>
        {messages.map(message => (
          <li key={message._id.toString()}>
            <span>{message.author}:</span>
            <span>{message.body}</span>
            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
          </li>
        ))}
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
