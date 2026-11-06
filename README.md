# Emotion Detection Application

A web application developed using Python, Flask, and IBM Watson NLP library to analyze emotions from text inputs.

## Project Description
This project detects five emotions from given English statements:
- Anger
- Disgust
- Fear
- Joy
- Sadness

It also identifies the **dominant emotion** with the highest confidence score.

## Directory Structure
```
emotion_detection_app/
├── EmotionDetection/
│   ├── __init__.py
│   └── emotion_detection.py
├── static/
│   └── mywebscript.js
├── templates/
│   └── index.html
├── server.py
├── test_emotion_detection.py
├── README.md
└── .gitignore
```

## Setup and Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AnRhino/AIL304m_emotion_detection_app.git
   cd AIL304m_emotion_detection_app
   ```
2. Install requirements:
   ```bash
   pip install requests flask
   ```
3. Run Unit Tests:
   ```bash
   python3 -m unittest test_emotion_detection.py
   ```
4. Run Static Code Analysis:
   ```bash
   pylint server.py
   ```
5. Start the Web Server:
   ```bash
   python3 server.py
   ```
