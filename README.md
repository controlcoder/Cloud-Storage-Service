# Cloud Storage Platform

A full-stack cloud storage application that allows users to securely upload, organize, access, and manage files through a hierarchical folder structure. The platform supports Email/Password authentication with OTP verification, Google OAuth login, Redis-backed session management, role-based access control, and direct-to-S3 uploads using presigned URLs.

The system is designed around security, scalability, and data integrity, combining MongoDB for persistent metadata storage, Redis for session management, AWS S3 for object storage, and React for the frontend.

---

# Features

## Authentication & Authorization

* Email/Password authentication
* OTP-based email verification during registration
* Google OAuth login
* Redis-backed session management
* Signed HTTP-only cookies
* Role-Based Access Control (RBAC)

  * Admin
  * Manager
  * User
* Session expiration and invalidation

## File Management

* Upload files directly to AWS S3
* Download files securely using presigned URLs
* Browser preview support
* Rename files
* Delete files
* Upload integrity verification
* Upload state tracking

## Directory Management

* Create folders
* Rename folders
* Delete folders recursively
* Hierarchical directory tree
* Automatic storage size propagation

## Admin Features

* View all users
* Monitor active users
* Soft delete user accounts
* Force logout capabilities
* Role-based administration

## Storage Management

* Per-user storage quotas
* Storage usage tracking
* Directory-level size aggregation
* Automatic quota enforcement

## Security

* bcrypt password hashing
* Google ID token verification
* Signed session cookies
* Private S3 bucket architecture
* Time-limited presigned URLs
* Resource ownership validation
* Multi-layer input validation

---

# Tech Stack

## Frontend

* React
* Vite
* Axios
* Context API

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Session Store

* Redis

## Cloud Storage

* AWS S3

## Authentication

* Google OAuth
* OTP Verification
* Redis Session Authentication

## Email Service

* Resend

---

# High Level Architecture

```text
┌─────────────────────┐
│     React Client    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Express Server   │
└───┬────────┬─────┬──┘
    │        │     │
    ▼        ▼     ▼

┌────────┐ ┌──────────┐ ┌────────┐
│ Redis  │ │ MongoDB  │ │ AWS S3 │
└────────┘ └──────────┘ └────────┘

 Sessions    Metadata      Files
```

---

# Authentication Architecture

The application uses session-based authentication instead of JWTs.

```text
User Login
    │
    ▼
Generate Session ID
    │
    ▼
Store Session in Redis
    │
    ▼
Set Signed Cookie (sid)
    │
    ▼
Future Requests
    │
    ▼
Redis Session Lookup
    │
    ▼
Authenticated User
```

### Why Redis?

Redis acts as a distributed session store:

* Fast session lookup
* Automatic expiration
* Easy logout
* Session revocation
* Horizontal scalability

---

# Registration Flow

```text
User Registration
       │
       ▼
Enter Email
       │
       ▼
Generate OTP
       │
       ▼
Send Email via Resend
       │
       ▼
Store OTP in MongoDB
       │
       ▼
Verify OTP
       │
       ▼
MongoDB Transaction
       │
 ┌─────┴─────┐
 ▼           ▼
Create User  Create Root Directory
       │
       ▼
Registration Complete
```

### OTP Expiration

MongoDB TTL indexes automatically remove OTP records after 10 minutes.

---

# Google OAuth Flow

```text
User
 │
 ▼
Google Sign-In
 │
 ▼
Google ID Token
 │
 ▼
Backend Verification
 │
 ▼
Create/Login User
 │
 ▼
Create Redis Session
 │
 ▼
Authenticated
```

The backend verifies Google-issued ID tokens before authenticating users.

---

# File Upload Architecture

The application uses a direct-to-S3 upload pipeline.

```text
Client
   │
   ▼
Request Upload URL
   │
   ▼
Backend
   │
Generate Presigned URL
   │
   ▼
Client ─────────────► AWS S3
         Upload File
```

### Benefits

* Files never pass through Express
* Lower server bandwidth usage
* Better scalability
* Faster uploads
* Reduced server load

---

# Upload Verification Flow

```text
Initiate Upload
      │
      ▼
Create MongoDB Record
      │
      ▼
isUploading = true
      │
      ▼
Upload File to S3
      │
      ▼
Verify File Metadata
      │
      ▼
Size Match?
      │
   Yes ▼
      │
isUploading = false
      │
      ▼
Update Directory Sizes
```

If verification fails, the upload record is removed.

---

# Secure Download Flow

Files are never publicly exposed.

```text
User Request
      │
      ▼
Verify Ownership
      │
      ▼
Generate Signed URL
      │
      ▼
Redirect User
      │
      ▼
Temporary S3 Access
```

Presigned URLs expire automatically after 5 minutes.

---

# Directory Architecture

Directories are organized as a tree.

```text
Root
│
├── Documents
│   ├── Notes
│   └── Books
│
├── Images
│   ├── Travel
│   └── Personal
│
└── Videos
```

Each directory stores:

* Name
* Parent Directory
* Owner
* Aggregated Size

---

# Storage Size Propagation

When a file is uploaded:

```text
Root
│
└── Folder A
     │
     └── Folder B
           │
           └── File
```

The size is propagated upward:

```text
File Size
    │
    ▼
Folder B
    │
    ▼
Folder A
    │
    ▼
Root
```

This enables efficient storage usage calculation.

---

# Recursive Directory Deletion

Deleting a folder automatically:

```text
Directory
│
├── Sub Directory
│   ├── File
│   └── File
│
└── File
```

removes:

* All descendant directories
* All file metadata
* All S3 objects

using bulk deletion operations.

---

# Data Model

## User

```text
User
├── name
├── email
├── password
├── role
├── rootDirId
├── maxStorageInBytes
├── deleted
└── picture
```

## Directory

```text
Directory
├── name
├── size
├── userId
└── parentDirId
```

## File

```text
File
├── name
├── extension
├── size
├── userId
├── parentDirId
└── isUploading
```

---

# Data Integrity Strategy

The application uses multiple validation layers.

```text
Frontend Validation
        │
        ▼
Zod Validation
        │
        ▼
Route Validation
        │
        ▼
Controller Logic
        │
        ▼
Mongoose Strict Mode
        │
        ▼
MongoDB JSON Schema Validation
```

### Validation Technologies

* Zod request validation
* MongoDB JSON Schema validators
* Mongoose strict mode
* Route parameter validation

---

# Security Measures

## Password Security

Passwords are hashed using:

```text
bcrypt (12 salt rounds)
```

before being stored.

---

## Session Security

```text
Signed Cookies
+
HTTP Only Cookies
+
Redis Session Store
```

protect authentication state.

---

## Resource Isolation

Every file and directory operation validates ownership:

```text
User A
  ❌
Cannot Access
  ❌
User B Resources
```

---

## Private Cloud Storage

Files remain private in S3.

Access is granted only through temporary presigned URLs.

---

# Storage Quotas

Each user receives:

```text
1 GB Default Storage
```

Uploads are validated before storage allocation.

```text
Current Usage
      +
Incoming File Size
      >
Maximum Quota
      ?
```

If exceeded:

```text
Upload Rejected
```

---

# Project Structure

```text
client/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── App.jsx
│

server/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── validators/
└── app.js
```

---

# Getting Started

## Clone Repository

```bash
git clone <repository-url>
cd <project-name>
```

## Install Dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

## Configure Environment

Create `.env` files using the provided `.env.example` files.

---

## Run Backend

```bash
cd server
npm run dev
```

---

## Run Frontend

```bash
cd client
npm run dev
```

---

# Future Improvements

* Multipart uploads for very large files
* File sharing links
* Folder sharing
* Search functionality
* Storage analytics dashboard
* Activity logs
* Versioned files
* Real-time upload progress tracking

---

# Key Engineering Highlights

* Direct-to-S3 uploads using presigned URLs
* Redis-backed distributed session management
* MongoDB transactions during user onboarding
* Automatic OTP expiration using TTL indexes
* Hierarchical directory tree with recursive deletion
* Storage quota enforcement
* Upload integrity verification
* MongoDB JSON Schema validation
* Multi-layer validation architecture
* Role-Based Access Control (RBAC)
* Secure private object storage using temporary signed URLs