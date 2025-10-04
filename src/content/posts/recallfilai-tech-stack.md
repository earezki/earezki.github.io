---
title: 'Recallfilai part 1: requirements and tech stack'
pubDate: '2025-02-10 00:00:46 +0100'
categories:
  - '2025'
  - tech
  - recallfilai
---

### What is:
Document store with AI capabilities (**recallfilai** because AI is the hot word as of now) is the new year's opensource project for 2025. 

### **Features**:
* Upload, store, download documents.
* Support text files, pdf, word, audio, video,
* Accept a url and download the page as a content.
* Support for dynamic metadata.
* Malware detection.
* Basic search (metadata & content).
* Vector search.
* RAG / QA.
* auto tagging.
* Multi-tenant.
* OIDC authn/authz.
* Audit.
* Workflow.
* Summarization and topics extraction.
* Notify document changes via webhooks.
* Import from external sources (dropbox, gdrive, ...)
* Zero-Knowledge Encryption: Ensure only the user can decrypt stored documents.
* TBD ...

### **Technologies**:
* Backend:
  * AI: Python, FastAPI, LangChain, RabbitMQ.
  * API: Java, Spring boot, MongoDB.
  * Malware: Python, Clamav, RabbitMQ.
* AI: Ollama.
* Database: Qdrant.
* Storage: Mongo, S3 (MinIO).
* Authn/authz: Keycloak.
* Frontend: Typescript + ReactJS + Bootstrap.

### Malware detection:
When the api receives a request to add a file.
1. downloads the file in temp dir.
2. stores it in s3.
3. sends an async request to the malware detection service.
4. listens to the response and acts accordingly.
    * if malware detected, deletes the file from s3 add it's hash to a blacklist.
    * keep the metadata of the content with the malware status set to **MALWARE_DETECTED**.


### **Resources**
(this section will be updated frequently)
* https://qdrant.tech/documentation/
