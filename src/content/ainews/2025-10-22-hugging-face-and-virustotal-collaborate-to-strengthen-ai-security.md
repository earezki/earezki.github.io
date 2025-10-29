---
title: "Hugging Face and VirusTotal Partner to Enhance AI Security"
pubDate: "2025-10-23"
description: "Hugging Face and VirusTotal have collaborated to continuously scan the Hugging Face Hub's 2.2M+ public models and datasets for malicious content, enhancing security for the machine learning community."
categories: ["AI News", "Security", "Open Source"]
---

## Hugging Face and VirusTotal Collaborate to Strengthen AI Security

This article announces a partnership between Hugging Face, a leading open platform for machine learning models and datasets, and VirusTotal, a threat intelligence and malware analysis platform. The collaboration aims to enhance the security of files shared on the Hugging Face Hub by continuously scanning the 2.2 million+ public model and dataset repositories for malicious content. This initiative is crucial for protecting the AI community from potentially harmful assets.

### Key Details of the Collaboration

*   **Partners:** Hugging Face and VirusTotal
*   **Initiative:** Continuous scanning of all public model and dataset repositories on the Hugging Face Hub.
*   **Scope:** 2.2 million+ public model and dataset repositories.
*   **Start Date:** Today (October 23, 2025)
*   **Data Privacy:** No raw file contents are shared with VirusTotal, ensuring user privacy and compliance.

### Why This Collaboration is Important

The increasing complexity of AI models, including large binary files, serialized data, and dependencies, introduces potential security risks.  The Hugging Face Hub, as the largest open platform for machine learning, needs to ensure the safety of shared assets. The collaboration with VirusTotal addresses these risks by:

*   Detecting malicious payloads disguised as model files or archives.
*   Identifying files compromised before upload.
*   Flagging binary assets linked to known malware campaigns.
*   Identifying unsafe code within dependencies or serialized objects.

### How the Collaboration Works

The integration works automatically:

1.  **File Hashing:** When a user visits a repository or file page, the Hub retrieves VirusTotal information about the corresponding files.
2.  **Threat Intelligence Check:** The file hash is compared against VirusTotal's threat intelligence database.
3.  **Status Retrieval:** If the file hash has been previously analyzed, its status (clean or malicious) is retrieved.
4.  **Metadata:** Results include metadata such as detection counts, known-bad relationships, or associated threat campaign intelligence.

### Benefits for the Community

*   **Transparency:** Users can see if files have been previously flagged by VirusTotal.
*   **Safety:** Organizations can integrate VirusTotal checks into their CI/CD pipelines to prevent malicious assets.
*   **Efficiency:** Leverages existing VirusTotal intelligence, reducing redundant scanning.
*   **Trust:** Enhances the Hugging Face Hub as a secure and reliable platform for open-source AI collaboration.

### Further Information

For more information or to contribute to a safer open-source AI ecosystem, individuals can contact security@huggingface.co. The goal is to make AI collaboration secure by design.

**Reference:** [https://huggingface.co/blog/virustotal](https://huggingface.co/blog/virustotal)