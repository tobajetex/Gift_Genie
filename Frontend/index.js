import { marked } from "marked";
import DOMPurify from "dompurify";
import { autoResizeTextarea, setLoading } from "./utils.js";

// Get UI elements
const giftForm = document.getElementById("gift-form");
const userInput = document.getElementById("user-input");
const outputContent = document.getElementById("output-content");

function start() {
  userInput.addEventListener("input", () => autoResizeTextarea(userInput));
  giftForm.addEventListener("submit", handleGiftRequest);
}

async function handleGiftRequest(e) {
  e.preventDefault();

  const userPrompt = userInput.value.trim();
  if (!userPrompt) return;

  setLoading(true);

  try {
    const response = await fetch("http://localhost:3001/api/gift", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userPrompt }),
    });
    const data = await response.json();

    // showStream();
    const giftSuggestions = data.message;

    // Convert Markdown to HTML
    const html = marked.parse(giftSuggestions);

    // Sanitize the HTML to prevent XSS attacks
    const safeHTML = DOMPurify.sanitize(html);

    // Render the output
    outputContent.innerHTML = safeHTML;

    // outputContent.textContent = safeHTML;
  } catch (error) {
    if (error.status === 429) {
      // retry after delay or show message to user;
      outputContent.textContent = "retry after delay or show message to user";
    }
    console.error(error);
    outputContent.textContent = "Something went wrong. Check the console.";
  } finally {
    setLoading(false);
  }
}

start();
