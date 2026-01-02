****MalScan AI — Intelligent Malware Analysis & Classification Platform****

MalScan AI is a web-based malware analysis platform that performs both static and dynamic analysis on unknown software binaries and classifies them into malware families using Deep Learning.

The system supports all major executable formats (EXE, DLL, BIN, ELF, APK, etc.) and delivers results through a modern cybersecurity-grade UI inspired by VirusTotal and AnyRun.

**🔥 Features**

*✅ 1. Multi-Format Binary Upload*

Supports:

.exe, .dll, .sys, .msi, .scr, .ocx (Windows)

.elf, .so (Linux)

.bin, .dat, .img, .dump (Raw binaries)

.apk, .dex (Mobile)

*✅ 2. Static Malware Analysis*

Automatically extracts:

API call sequences

Opcodes (Capstone disassembly)

Strings

PE/ELF header metadata

Imported/Exported functions

File/Section entropy

Binary structure breakdown

*✅ 3. Dynamic Analysis (Sandbox)*

Runs the file inside a secure sandbox (or sandbox mock) and observes:

File operations

Registry changes

Network behavior

Process activity

Behavioral logs

✅ 4. Deep Learning Malware Classification

Uses a LSTM/CNN-based model trained on opcode/API sequences to classify files into malware families such as:

Ransomware

Trojan

Worm

Spyware

Adware

Rootkit

Downloader

Backdoor

Outputs:

Predicted family

Confidence percentage

Probability distribution chart

✅ 5. Professional Frontend (React / Next.js)

Modern cyber-themed UI with:

File upload interface

Real-time progress

Visualization charts:

Opcode histogram

API sequence timeline

Entropy graph

Malware probability bars

Detailed analysis pages

History page

API documentation page

Login / Signup

✅ 6. Backend (FastAPI)

Clean, modular backend with:

/upload

/analyze/static

/analyze/dynamic

/classify

/history

/auth/login

/auth/signup

/report/{id} (PDF generator)

Integrated with:

Static feature extractor

Dynamic analyzer

ML classifier

Database (MongoDB/PostgreSQL)

✅ 7. PDF Report Generator

Download a full malware analysis report including:

File metadata

Static & dynamic features

ML classification

Confidence score

Charts & graphs

User & timestamp info

🏗 Tech Stack
Frontend

React / Next.js

TailwindCSS

Recharts / Chart.js

Framer Motion

Backend

FastAPI

Python

pefile

capstone

python-magic

TensorFlow / PyTorch

pdfkit / reportlab

Database

MongoDB or PostgreSQL

📁 Project Structure
/frontend
/backend
/model
/database
/services
/utils
/public

⚙️ How It Works (High-Level Flow)

User uploads a binary

Backend extracts static features

Sandbox performs dynamic analysis (optional)

ML model predicts malware family

Results are displayed with graphs

History is stored in DB

User can download a PDF report

🚀 Setup & Installation
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/malscan-ai.git
cd malscan-ai

2️⃣ Install Backend Dependencies
cd backend
pip install -r requirements.txt

3️⃣ Start FastAPI
uvicorn main:app --reload

4️⃣ Install Frontend
cd ../frontend
npm install
npm run dev


