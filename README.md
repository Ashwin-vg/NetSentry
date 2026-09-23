# 🛡️ NetSentry

### Network Security Monitoring & Threat Detection Platform

NetSentry is a network security monitoring and threat detection platform designed to discover network assets, perform authorized network scans, identify exposed services, analyze security exposure using rule-based detection, generate evidence-based findings, and maintain a persistent security assessment history.

---
## 🌐 Live Demo

🚀 **Live Application:** https://netsentry-l0s8.onrender.com

📡 **Backend API:** https://netsentry-backend-fiud.onrender.com

📚 **API Documentation:** https://netsentry-backend-fiud.onrender.com/docs

# 🚀 Features

### 🔐 Authentication & Security

- JWT-based authentication
- Secure password hashing with bcrypt
- Protected security APIs
- Protected network discovery
- Protected network scanning
- Protected scan history
- Protected security findings
- Bearer token authentication
- Token expiry handling
- Logout and session clearing
- Environment-based secret management

### 🌐 Network Discovery

NetSentry uses local ARP information to discover devices visible on the local network.

- Local network host discovery
- IP address identification
- MAC address identification
- Network interface identification
- Duplicate device filtering
- Host inventory

### 🔎 Network Scanning

NetSentry integrates Nmap for authorized targeted network assessment.

- TCP port scanning
- Open port detection
- Service identification
- Service version detection
- Target-specific scanning
- Scan duration measurement
- Persistent scan results

### 🧠 Risk Analysis

NetSentry uses a rule-based risk analysis engine to identify potentially exposed services.

Current rules include:

- FTP
- SSH
- Telnet
- HTTP
- HTTPS
- SMB
- RDP
- MySQL
- PostgreSQL
- Redis
- MongoDB
- Elasticsearch
- Alternative HTTP services
- Application services

Each detected service can generate a security finding containing:

- Category
- Severity
- Title
- Description
- Recommendation
- Confidence
- Evidence

### 📊 Security Dashboard

- Discovered device statistics
- Scan statistics
- Finding statistics
- Latest risk score
- Risk level
- Finding severity breakdown
- Recent scan activity
- System status

### 📋 Security Findings

- Finding search
- Severity filtering
- Security categories
- Target information
- Port information
- Service information
- Version information
- Confidence level
- Evidence
- Security recommendations

### 🗂️ Scan History

NetSentry stores completed security assessments in MongoDB.

Stored information includes:

- Target
- Open ports
- Findings
- Finding count
- Risk score
- Risk level
- Scanner
- Scan duration
- Timestamp
- Authenticated operator

### 🔬 Scan Details

Each stored scan can be opened for detailed analysis.

The Scan Details interface provides:

- Scan metadata
- Open ports
- Services
- Service versions
- Security findings
- Evidence
- Recommendations
- Confidence

---

# 🏗️ Architecture

```text
                         ┌───────────────────────┐
                         │     NetSentry UI      │
                         │     React + Vite      │
                         └───────────┬───────────┘
                                     │
                              REST API Requests
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    FastAPI Backend    │
                         │                       │
                         │ Authentication        │
                         │ Network Discovery     │
                         │ Network Scanner       │
                         │ Risk Analyzer         │
                         │ Findings              │
                         │ Scan History          │
                         └───────────┬───────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
           ┌─────────────────┐              ┌─────────────────┐
           │      Nmap       │              │     MongoDB     │
           │                 │              │                 │
           │ Port Scanning   │              │ Users           │
           │ Service Scan    │              │ Devices         │
           │ Version Scan    │              │ Scans           │
           └────────┬────────┘              │ Findings        │
                    │                       └─────────────────┘
                    ▼
           ┌─────────────────┐
           │  Risk Analyzer  │
           │                 │
           │ Rule Matching   │
           │ Severity        │
           │ Confidence      │
           │ Evidence        │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Security        │
           │ Findings        │
           └─────────────────┘
```

---

# 🔄 Security Assessment Pipeline

```text
Network Discovery
        ↓
Local ARP Inventory
        ↓
Authorized Target
        ↓
Nmap Scan
        ↓
Open Port Detection
        ↓
Service Detection
        ↓
Version Detection
        ↓
Risk Analysis
        ↓
Security Findings
        ↓
Evidence Generation
        ↓
MongoDB
        ↓
Dashboard / History
```

---

# 🧠 Risk Analysis Engine

NetSentry analyzes Nmap results using a rule-based detection engine.

```text
Nmap Result
     ↓
Port + Service
     ↓
Rule Matching
     ↓
Severity Classification
     ↓
Security Finding
     ↓
Evidence + Recommendation
```

Only ports with configured security rules are converted into security findings.

---

# 📊 Risk Scoring

NetSentry uses an exposure-based risk scoring model.

| Severity | Weight |
|----------|-------:|
| Low | 10 |
| Medium | 25 |
| High | 40 |
| Critical | 60 |

The final score is capped at `100`.

### Risk Levels

```text
0          → NONE
1–29       → LOW
30–59      → MEDIUM
60–79      → HIGH
80–100     → CRITICAL
```

### Example

```text
SMB
 ↓
MEDIUM
 ↓
25

MySQL
 ↓
MEDIUM
 ↓
25

Application Service
 ↓
LOW
 ↓
10

TOTAL
 ↓
60 / 100
 ↓
HIGH
```

The score represents detected network/service exposure.

It is not a CVSS score and does not independently confirm a vulnerability, exploitation, or compromise.

---

# 🔎 Evidence-Based Findings

NetSentry connects security findings to the underlying scan evidence.

### Example

```text
Security Finding

Title:
SMB service detected

Category:
Network Exposure

Severity:
Medium

Evidence:

Port:
445

Protocol:
TCP

Service:
microsoft-ds

Version:
unknown

Confidence:
Medium
```

This allows a finding to be traced back to the network observation that generated it.

---

# 🎯 Service Detection

NetSentry currently contains security rules for:

```text
FTP
SSH
Telnet
HTTP
HTTPS
SMB
RDP
MySQL
PostgreSQL
Redis
MongoDB
Elasticsearch
```

Additional application and web exposure rules include:

```text
8080
8000
```

Service-specific enrichment can include detected service and version information.

---

# 📋 Finding Structure

A security finding can contain:

```text
Target
Port
Protocol
Service
Version
Category
Severity
Title
Description
Recommendation
Confidence
Evidence
```

### Example Evidence

```json
{
  "port": 3306,
  "protocol": "tcp",
  "service": "mysql",
  "version": "unknown"
}
```

---

# 🔐 Authentication Flow

NetSentry uses JWT-based authentication for protected API access.

```text
User
 ↓
Register / Login
 ↓
FastAPI Authentication
 ↓
Password Verification
 ↓
JWT Access Token
 ↓
Frontend
 ↓
Bearer Token
 ↓
Protected API
```

Passwords are hashed using bcrypt before being stored.

Protected requests use:

```text
Authorization: Bearer <access_token>
```

Invalid or expired authentication tokens are rejected by the backend.

---

# 📡 API Overview

## Authentication

```text
POST /auth/register
POST /auth/login
```

## Network Discovery

```text
GET /network/discover
```

## Network Scanner

```text
GET /scanner/ports
```

## Scan History

```text
GET /history/scans
GET /history/scans/{scan_id}
```

## Security Findings

```text
GET /findings/
```

---

# 🛡️ API Security

Security-sensitive endpoints require a valid Bearer JWT.

Protected areas include:

```text
/network/*
/scanner/*
/history/*
/findings/*
```

Authentication endpoints include:

```text
/auth/register
/auth/login
```

Example:

```text
Authorization: Bearer <access_token>
```

Unauthenticated access to protected endpoints is rejected by the backend.

---

# 🗄️ Database

NetSentry uses MongoDB for persistent storage.

The platform stores information including:

```text
Users
Devices
Scans
Findings
Risk Scores
Scan Metadata
Timestamps
Operators
```

The MongoDB connection is loaded through environment variables.

---

# 📁 Project Structure

```text
netsentry/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── network.py
│   │   │   ├── scanner.py
│   │   │   ├── history.py
│   │   │   └── findings.py
│   │   │
│   │   ├── services/
│   │   │   ├── network_scanner.py
│   │   │   ├── port_scanner.py
│   │   │   └── risk_analyzer.py
│   │   │
│   │   └── security/
│   │       └── auth.py
│   │
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Network.jsx
│   │   │   ├── Scanner.jsx
│   │   │   ├── Findings.jsx
│   │   │   ├── History.jsx
│   │   │   ├── ScanDetails.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- Lucide React

## Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

## Database

- MongoDB
- PyMongo

## Network Security

- Nmap
- ARP

## Authentication

- JWT
- bcrypt
- python-jose

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd netsentry
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate the environment on macOS / Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
python3 -m pip install fastapi uvicorn pymongo python-dotenv bcrypt "python-jose[cryptography]" "pydantic[email]"
```

---

# 🔑 Environment Variables

Create:

```text
backend/.env
```

Add:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=netsentry
JWT_SECRET=your_secure_secret_key
```

Never commit `.env` to GitHub.

Use placeholder values in `.env.example`.

Example:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=netsentry
JWT_SECRET=your_secure_secret_key
```

---

# ▶️ Running the Backend

From:

```text
netsentry/backend
```

Run:

```bash
python3 -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

---

# ▶️ Running the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Validation

NetSentry can be validated through the following workflow:

```text
User Registration
        ↓
User Login
        ↓
JWT Authentication
        ↓
Protected API Access
        ↓
Network Discovery
        ↓
Authorized Target Scan
        ↓
Nmap Results
        ↓
Risk Analysis
        ↓
Security Findings
        ↓
MongoDB Persistence
        ↓
Scan History
        ↓
Scan Details
```

Frontend linting:

```bash
npm run lint
```

---

# 🔬 Scan Metadata

Every completed scan can store operational metadata.

### Example

```text
Target:
127.0.0.1

Scanner:
Nmap

Operator:
admin

Duration:
26.58s

Risk Score:
60 / 100

Risk Level:
HIGH
```

This information provides additional context for historical security assessments.

---

# 🗂️ Scan History

NetSentry maintains a persistent record of completed scans.

```text
Authorized Scan
      ↓
Nmap Results
      ↓
Risk Analysis
      ↓
Findings Generated
      ↓
Metadata Added
      ↓
MongoDB
      ↓
Scan History
      ↓
Scan Details
```

Historical scans can be opened to review their complete assessment data.

---

# 🌐 Network Discovery

NetSentry uses the local ARP table for network inventory.

```text
Local Network
      ↓
ARP Table
      ↓
IP / MAC Extraction
      ↓
Duplicate Filtering
      ↓
Host Inventory
      ↓
Network Dashboard
```

The discovery system is intended for local network visibility.

---

# 🛡️ Security Controls

```text
                  NetSentry Security
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
       JWT Auth    Password Hashing   Protected APIs
           │             │             │
           └─────────────┼─────────────┘
                         │
                         ▼
                  Token Validation
                         │
                         ▼
                Authorized Operations
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       Network Discovery       Targeted Scanning
              │                     │
              └──────────┬──────────┘
                         ▼
                   Risk Analysis
                         │
                         ▼
                Evidence-Based Findings
```

---

# ⚠️ Security Considerations

### Authorization

Only scan systems and networks that you own or have explicit authorization to test.

### Network Discovery

ARP-based discovery is intended for local network inventory.

### Targeted Scanning

Nmap scanning should only be performed against authorized targets.

### Open Ports

An open port does not automatically represent a vulnerability.

NetSentry identifies configured service exposures based on its rule set.

### Risk Score

The risk score is an exposure-based heuristic.

It should not be interpreted as:

```text
CVSS Score
Confirmed Vulnerability
Successful Exploitation
System Compromise
```

### Production Security

A production deployment should additionally use:

- HTTPS
- Strong JWT secrets
- Secure database authentication
- Strong password policies
- Secure token handling
- Proper firewall configuration
- Production CORS configuration
- Role-based access control

---

# 🧩 Design Principles

### Evidence Before Conclusions

Findings are generated from observable scan results rather than assuming that every open port represents a vulnerability.

### Authorization First

Network assessment should only be performed against systems that the user owns or has permission to test.

### Modular Architecture

Network discovery, scanning, risk analysis, authentication, persistence, and frontend presentation are separated into dedicated modules.

### Persistent History

Completed assessments are stored for later analysis and review.

### Traceable Findings

Findings contain evidence describing the port, protocol, service, and version information associated with the detection.

---

# 📸 Screenshots

Recommended screenshots:

```text
docs/screenshots/
├── login.png
├── dashboard.png
├── network.png
├── scanner.png
├── findings.png
├── history.png
└── scan-details.png
```

Screenshots can be added to this README to demonstrate the NetSentry security console.

---

# 🚧 Future Improvements

Potential future development includes:

- CVE integration
- CVSS scoring
- Vulnerability correlation
- Additional service-specific detection
- TLS configuration analysis
- HTTP security-header analysis
- Scheduled authorized scans
- Security alerts
- Email notifications
- Role-based access control
- Asset management
- PDF security reports
- Historical risk trends
- Network topology visualization
- Advanced vulnerability correlation
- Automated security assessment reports

---

# 🎯 Project Goals

NetSentry was developed to demonstrate practical concepts involved in building a network security monitoring and assessment platform, including:

- Computer Networking
- Network Discovery
- TCP/IP
- Port Scanning
- Nmap
- Service Detection
- Security Analysis
- Risk Assessment
- FastAPI
- REST APIs
- React
- JWT Authentication
- Password Hashing
- MongoDB
- Security Findings
- Evidence Collection
- Audit Logging
- Security Dashboards

---

# 👨‍💻 Author

## Ashwin V G

Computer Science & Engineering

Cybersecurity Enthusiast

Interested in:

- Cybersecurity
- Network Security
- Ethical Hacking
- Web Security
- Security Engineering
- Backend Development

---

# 📄 License

This project is intended for educational, research, and portfolio purposes.

---

# ⚠️ Disclaimer

NetSentry is intended for educational, defensive, and authorized security testing purposes only.

Do not use the scanner against systems or networks without appropriate authorization.

Always obtain appropriate permission before performing network security testing.
