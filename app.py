from functools import lru_cache

from flask import Flask, render_template, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

app = Flask(__name__)

MODEL_PATH = {
    "en": "models/english",
    "de": "models/german",
    "es": "models/spanish",
}

SUPPORTED = {
    "de": "German",
    "en": "English",
    "es": "Spanish",
}


def normalize_label(label: str) -> str:
    l = (label or "").strip().lower()
    if "label_0" in l:
        return "positive"
    if "label_1" in l:
        return "neutral"
    if "label_2" in l:
        return "negative"
    return "neutral"


@lru_cache(maxsize=len(MODEL_PATH))
def get_pipe(lang: str):
    """
    Returns a cached HF pipeline per language.
    This fixes the issue where a single cached pipeline kept using the old model/tokenizer.
    """
    lang = (lang or "en").lower().strip()
    if lang not in MODEL_PATH:
        lang = "en"

    tok = AutoTokenizer.from_pretrained(
        MODEL_PATH[lang],
        use_fast=True,
        fix_mistral_regex=True,
    )
    mdl = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH[lang])

    return pipeline("sentiment-analysis", model=mdl, tokenizer=tok)


def classify(text: str, lang: str) -> dict:
    lang = (lang or "en").lower().strip()
    if lang not in SUPPORTED:
        lang = "en"

    out = get_pipe(lang)(text)[0]

    label = normalize_label(out.get("label"))
    score = float(out.get("score", 0.0))

    scores = {"positive": 0.0, "neutral": 0.0, "negative": 0.0}
    scores[label] = score

    return {"lang": lang, "label": label, "scores": scores, "raw": out}


@app.get("/")
def home():
    return render_template("index.html", languages=SUPPORTED)


@app.post("/api/classify")
def api_classify():
    data = request.get_json(force=True, silent=True) or {}
    text = (data.get("text") or "").strip()
    lang = (data.get("lang") or "en").strip()

    if not text:
        return jsonify({"error": "Empty text"}), 400

    try:
        return jsonify(classify(text, lang))
    except Exception as e:
        return jsonify({"error": f"Classification failed: {e}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)