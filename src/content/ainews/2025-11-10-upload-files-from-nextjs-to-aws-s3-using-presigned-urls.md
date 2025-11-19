---
title: "Secure File Uploads from Next.js to AWS S3 Using Presigned URLs"
pubDate: 2025-11-10
description: "Learn how to securely upload files from a Next.js frontend to AWS S3 using presigned URLs, avoiding exposure of AWS credentials while ensuring scalability and security."
categories: ["AI News", "aws", "nextjs", "devops", "webdev"]
---

## Secure File Uploads from Next.js to AWS S3 Using Presigned URLs

This tutorial explains how to securely upload files from a Next.js frontend to AWS S3 using **presigned URLs**, which grant temporary access to upload files without exposing AWS credentials. The approach ensures security, scalability, and direct uploads to AWS, bypassing the backend server.

---

### 🧠 Why Use Presigned URLs?

Presigned URLs provide **temporary, limited-time access** to AWS S3 resources, ensuring:
- **Security**: No AWS credentials are exposed to the frontend.
- **Performance**: Files are uploaded directly to S3, reducing server load.
- **Scalability**: Suitable for production applications with high upload volumes.

---

### 🔧 Prerequisites

Before starting, ensure you have:
- An **AWS account** with S3 access.
- A **Next.js project** set up with Node.js.
- Basic knowledge of **environment variables**.

---

### 📁 Step 1: Create and Configure an S3 Bucket

1. **Create a Bucket** in the AWS Console with a unique name and select a region (e.g., `ap-south-1`).
2. **Adjust Permissions**:
   - Uncheck "Block all public access" if public uploads are needed (optional).
3. **Add CORS Configuration** to allow cross-origin requests from your frontend:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

### 🔑 Step 2: Add Environment Variables

Store AWS credentials securely in a `.env.local` file in your Next.js project:

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your_bucket_name
```

**Never commit this file to version control** (e.g., GitHub).

---

### 🧩 Step 3: Install AWS SDK v3

Install the AWS SDK for S3 operations:

```bash
npm install @aws-sdk/client-s3
```

---

### 🧠 Step 4: Create an API Route for Presigned URLs

Create an API route in Next.js to generate a presigned URL for uploading files:

```javascript
// /app/api/upload-url/route.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");
  const fileType = searchParams.get("type");

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  return new Response(JSON.stringify({ url: signedUrl }), {
    headers: { "Content-Type": "application/json" },
  });
}
```

**Purpose**: This route generates a **60-second valid presigned URL** for a specific file and content type, which the frontend can use to upload directly to S3.

---

### 🧠 Step 5: Upload from Frontend

Create a component to handle file uploads using the presigned URL:

```javascript
// /app/upload/page.jsx
"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    // 1. Request presigned URL from API
    const res = await fetch(
      `/api/upload-url?file=${file.name}&type=${file.type}`
    );
    const { url } = await res.json();

    // 2. Upload file directly to S3
    const upload = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (upload.ok) {
      alert("✅ File uploaded successfully!");
    } else {
      alert("❌ Upload failed.");
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
```

**Key Features**:
- Uses the presigned URL to upload directly to S3.
- Displays a user-friendly interface with feedback.

---

### ⚠️ Step 6: Common Errors & Fixes

| **Error**         | **Cause**                          | **Fix**                                                                 |
|-------------------|------------------------------------|-------------------------------------------------------------------------|
| **403 Forbidden** | Incorrect IAM permissions          | Ensure the AWS user has `PutObject` permissions on the S3 bucket.     |
| **CORS Error**    | Missing CORS configuration         | Add the provided CORS policy to the S3 bucket.                        |
| **AccessDenied**  | Wrong region or credentials        | Verify `.env.local` values match your AWS setup.                      |

---

### 🧾 Step 7: Final Project Structure

```
app/
├─ api/
│ └─ upload-url/
│   └─ route.js
├─ upload/
│ └─ page.jsx
.env.local
```

---

### ✅ Conclusion

This method securely uploads files from a Next.js frontend to AWS S3 using **presigned URLs**, ensuring **no credentials are exposed**. It is efficient, scalable, and suitable for production applications. Always validate user input, handle errors gracefully, and ensure proper IAM permissions.

For the full source code and further guides, visit the [GitHub repository](https://github.com/ahadali0500/nextjs-s3-upload).

---

## Working Example

```javascript
// Example of generating a presigned URL (server-side)
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
  },
});

const command = new PutObjectCommand({
  Bucket: "your-bucket-name",
  Key: "example.txt",
  ContentType: "text/plain",
});

const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
console.log("Presigned URL:", signedUrl);
```

---

## Recommendations

- **Security**: Never expose AWS credentials in client-side code.
- **CORS**: Always configure S3 CORS policies to match your frontend domain.
- **Validation**: Validate file types and sizes on both the frontend and backend.
- **Error Handling**: Implement robust error handling for network failures or invalid URLs.
- **Timeouts**: Adjust the presigned URL expiration time (`expiresIn`) based on your use case.

For real-world applications, consider using **AWS Lambda** or **CloudFront** for additional security and performance optimizations.