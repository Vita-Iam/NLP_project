# Multilingual Sentiment Analysis Application

## Overview
This project implements a multilingual sentiment analysis pipeline for short text inputs in **English, Spanish, and German**. The system compares a classical machine learning baseline with a transformer-based approach and deploys the best performing models in a simple inference application.

## Models
Two modeling paradigms were explored:

### Baseline Model
- **TF-IDF** feature extraction
- **Shallow neural network** classifier  
Used as a language-specific baseline for English, Spanish, and German.

### Transformer-Based Models
- **English:** Fine-tuned **RoBERTa-base**
- **Spanish & German:** Fine-tuned **XLM-RoBERTa**

This setup enables language-specific optimization for English while leveraging a multilingual transformer for Spanish and German.

## Pipeline
1. User selects the input language
2. Text is tokenized using a language-appropriate tokenizer
3. The selected model performs inference
4. The output sentiment is classified as **Positive**, **Neutral**, or **Negative**

## Dataset
The experiments were conducted using the *Multilingual Sentiment Dataset*. For each supported language (English, Spanish, and German), the dataset was
provided with predefined **training, validation, and test splits**.

Each language subset is class-balanced, containing an equal number of samples per sentiment label (positive, neutral, and negative), ensuring that
model performance is not biased by label imbalance.

## Implementation
- **Frontend:** HTML, CSS, JS
- **Backend:** Python (Flask)
- **Frameworks:** PyTorch, TensorFlow, Hugging Face Transformers

## Application
A lightweight command-line application allows users to input a short sentence or comment and receive a sentiment prediction in real time.
