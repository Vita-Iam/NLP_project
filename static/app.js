const $ = (id) => document.getElementById(id);

const langEl = $("lang");
const textEl = $("text");
const goEl = $("go");
const statusEl = $("status");
const clearEl = $("clear");

const pill = {
  positive: $("p-positive"),
  neutral: $("p-neutral"),
  negative: $("p-negative"),
};

const scoreEl = {
  positive: $("s-positive"),
  neutral: $("s-neutral"),
  negative: $("s-negative"),
};

const fillEl = {
  positive: $("f-positive"),
  neutral: $("f-neutral"),
  negative: $("f-negative"),
};

const noteEl = {
  positive: $("n-positive"),
  neutral: $("n-neutral"),
  negative: $("n-negative"),
};

function resetUI() {
  ["positive", "neutral", "negative"].forEach((k) => {
    pill[k].classList.remove("active");
    scoreEl[k].textContent = "0.00";
    fillEl[k].style.width = "0%";
    noteEl[k].textContent = "—";
  });
}

function setActive(label) {
  ["positive", "neutral", "negative"].forEach((k) => {
    pill[k].classList.toggle("active", k === label);
    noteEl[k].textContent = (k === label) ? "Selected" : "Not selected";
  });
}

function setScores(scores) {
  ["positive", "neutral", "negative"].forEach((k) => {
    const v = Math.max(0, Math.min(1, Number(scores?.[k] ?? 0)));
    scoreEl[k].textContent = v.toFixed(2);
    fillEl[k].style.width = `${Math.round(v * 100)}%`;
  });
}

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

async function classify() {
  const text = (textEl.value || "").trim();
  const lang = (langEl.value || "en").trim();

  if (!text) {
    setStatus("Please enter some text first.");
    return;
  }

  goEl.disabled = true;
  setStatus("Classifying…");

  try {
    const res = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Request failed");

    setActive(data.label);
    setScores(data.scores);

    setStatus(`Result: ${data.label.toUpperCase()}`);
  } catch (e) {
    resetUI();
    setStatus(`Error: ${e.message}`);
  } finally {
    goEl.disabled = false;
  }
}

goEl.addEventListener("click", classify);

clearEl.addEventListener("click", () => {
  textEl.value = "";
  resetUI();
  setStatus("");
});

textEl.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") classify();
});

// init
resetUI();
