---
title: "Hugging Face and VirusTotal Collaborate to Enhance AI Security"
pubDate: "2025-10-23"
description: "Hugging Face and VirusTotal have partnered to continuously scan the Hugging Face Hub's 2.2M+ public models and datasets for malware, bolstering security for the machine learning community."
categories: ["AI News", "Security", "Open Source"]
---

## Collaboration for Enhanced AI Security

This article announces a collaboration between Hugging Face, a leading open-source AI platform, and VirusTotal, a prominent threat intelligence and malware analysis platform. The partnership aims to strengthen the security of files shared on the Hugging Face Hub, protecting the machine learning community from potentially malicious or compromised assets.  Starting today, all 2.2 million+ public model and dataset repositories on the Hugging Face Hub are being continuously scanned with VirusTotal.

### Key Details

*   **Partners:** Hugging Face and VirusTotal
*   **Initiative:** Continuous scanning of all public model and dataset repositories on the Hugging Face Hub.
*   **Scope:** 2.2 million+ public model and dataset repositories.
*   **Start Date:** Today (October 23, 2025)

### Why the Collaboration is Important

AI models, while powerful, present security risks due to their complex nature, including binary files, serialized data, and dependencies.  These assets can be vulnerable to:

*   Malicious payloads disguised as model files or archives.
*   Files compromised before upload.
*   Binary assets linked to known malware campaigns.
*   Unsafe code execution from dependencies or serialized objects.

The collaboration with VirusTotal adds a crucial layer of defense by leveraging VirusTotal's extensive malware intelligence database.

### How the Collaboration Works

The integration operates automatically:

1.  **File Hashing:** When a repository or file page is visited, the Hub retrieves VirusTotal information for the corresponding files.
2.  **Threat Intelligence Check:** The file hash is compared against VirusTotal's threat intelligence database.
3.  **Status Retrieval:** If a file hash has been previously analyzed, its status (clean or malicious) is retrieved from VirusTotal.
4.  **Privacy & Compliance:** No raw file content is shared with VirusTotal, ensuring user privacy and adherence to Hugging Face's data protection principles.
5.  **Result Metadata:**  The results include valuable metadata such as detection counts, known-bad relationships, and associated threat campaign intelligence (where available).

### Benefits for the Community

This collaboration offers several key benefits:

*   **Transparency:** Users can easily see if files have been previously flagged or analyzed by VirusTotal.
*   **Safety:** Organizations can integrate VirusTotal checks into their CI/CD or deployment workflows to prevent the spread of malicious assets.
*   **Efficiency:**  Leveraging VirusTotal's existing intelligence reduces the need for redundant scanning.
*   **Trust:** The collaboration enhances the Hugging Face Hub's security, making it a more reliable platform for open-source AI collaboration.

### Further Information

For more information or to contribute to a safer open-source AI ecosystem, interested parties can contact security@huggingface.co.  The goal is to foster secure AI collaboration by design.

**Reference Link:** [https://huggingface.co/blog/virustotal](https://huggingface.co/blog/virustotal)