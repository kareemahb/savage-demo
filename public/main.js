const messageList = document.querySelector("#messages");
const messageCount = document.querySelector("#message-count");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");
const textarea = document.querySelector("#msg");
const charCount = document.querySelector("#char-count");

const VOTES_KEY = "hello-kitty-fan-board-votes";

// ---------- Saved votes (one vote per message in this browser) ----------

const readVotes = () => {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY)) ?? {};
  } catch {
    return {};
  }
};

const saveVote = (id, direction) => {
  try {
    const votes = readVotes();
    votes[id] = direction;
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch {
    // Storage can be blocked. Voting still works, it just isn't remembered.
  }
};

// Highlight the votes this browser already made
const markVotes = () => {
  const votes = readVotes();

  document.querySelectorAll(".message").forEach((message) => {
    const vote = votes[message.dataset.id];
    message
      .querySelector(".action-up")
      .classList.toggle("voted", vote === "up");
    message
      .querySelector(".action-down")
      .classList.toggle("voted", vote === "down");
  });
};

// ---------- Helpers ----------

let toastTimer;

const showToast = (text) => {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
};

const sendRequest = async (url, method, body) => {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }

  return data;
};

const updateCount = () => {
  const total = messageList.querySelectorAll(".message").length;
  messageCount.textContent = total;
  emptyState.classList.toggle("hidden", total > 0);
};

// ---------- Actions ----------

const vote = async (message, direction, button) => {
  const { id } = message.dataset;

  if (readVotes()[id]) {
    showToast("You already voted on this message 💕");
    return;
  }

  button.disabled = true;

  try {
    const data = await sendRequest(`/messages/${id}/vote`, "PUT", {
      direction,
    });

    message.querySelector(".score").textContent = data.thumbUp;
    saveVote(id, direction);
    markVotes();

    button.classList.add("pop");
    button.addEventListener(
      "animationend",
      () => button.classList.remove("pop"),
      { once: true },
    );
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
  }
};

// The first click asks "Sure?", and a second click within 3 seconds deletes
const remove = async (message, button) => {
  if (!button.classList.contains("confirm")) {
    button.classList.add("confirm");
    button.innerHTML = "Sure?";
    setTimeout(() => {
      button.classList.remove("confirm");
      button.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    }, 3000);
    return;
  }

  button.disabled = true;

  try {
    await sendRequest(`/messages/${message.dataset.id}`, "DELETE");

    message.classList.add("removing");
    message.addEventListener(
      "animationend",
      () => {
        message.remove();
        updateCount();
      },
      { once: true },
    );

    showToast("Message deleted");
  } catch (error) {
    button.disabled = false;
    showToast(error.message);
  }
};

// One listener handles every button in the list
messageList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const message = button.closest(".message");
  const { action } = button.dataset;

  if (action === "delete") {
    remove(message, button);
  } else {
    vote(message, action, button);
  }
});

// ---------- Character counter ----------

const updateCharCount = () => {
  const max = textarea.maxLength;
  const length = textarea.value.length;

  charCount.textContent = `${length} / ${max}`;
  charCount.classList.toggle("near-limit", length >= max - 20);
};

textarea.addEventListener("input", updateCharCount);

markVotes();
updateCharCount();
