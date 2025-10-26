---
title: "Hugging Face AI Sheets Adds Vision Capabilities for Image-Based Data Analysis"
pubDate: "2025-10-21"
description: "Hugging Face releases a significant update to AI Sheets, introducing vision support to extract data from images, generate visuals from text, and edit images directly within a spreadsheet environment, powered by open-source AI models."
categories: ["AI News", "Data Science", "Open Source"]
---

## AI Sheets Integrates Vision: Unleashing the Power of Images in Spreadsheets

Hugging Face has announced a major update to its open-source AI Sheets tool, adding robust vision capabilities. This enhancement allows users to directly work with images within a spreadsheet, unlocking the potential to extract data, generate visuals, and edit images – all without requiring code.  AI Sheets leverages Inference Providers to access thousands of open AI models.

### Key Features and Capabilities

AI Sheets now empowers users to perform a wide range of operations on images, including:

*   **Data Extraction from Images:** The tool can extract structured data from various image types like receipts, documents, and diagrams. This includes pulling information such as merchant names, dates, amounts, and specific data points from charts.
*   **Image Generation from Text:** Users can generate images based on text prompts, enabling the creation of visuals for content creation, social media, and more.
*   **Image Editing and Transformation:** AI Sheets allows for modifying existing images, including style changes, adding elements, adjusting compositions, and creating variations at scale.
*   **Contextual Information:**  Images can be enriched with metadata, attributes, and custom annotations.
*   **Iteration and Feedback:**  Users can iterate on prompts, manually edit outputs, and provide feedback (thumbs-up) to improve model performance through few-shot learning.

### Use Cases and Examples

The article highlights several practical applications of AI Sheets with vision:

*   **Expense Tracking:** Extracting data from receipts to create structured expense reports.
*   **Recipe Digitization:** Converting handwritten recipes into searchable, structured datasets.
*   **Content Calendar Creation:** Generating images for social media posts directly within a spreadsheet.
*   **Data Analysis:** Analyzing visual data within spreadsheets to gain insights and identify trends.

**Example: Recipe Extraction**

The article details an example of using AI Sheets to extract information from an image of a handwritten recipe.  By using a custom prompt, the tool successfully extracted key ingredients and instructions, demonstrating its ability to handle complex image layouts.  Different models (Qwen/Qwen2.5-VL-7B-Instruct and Qwen3-VL-235B-A22B-Reasoning) were compared, showcasing varying levels of accuracy and detail.

### Technical Details and Workflow

*   **AI Actions:** Each column in AI Sheets can be transformed using AI actions, which are defined by a prompt and a model.
*   **Vision Models:** The tool utilizes a variety of vision models, with the default offering a balance of speed and accuracy. Users can experiment with thousands of models, including more powerful options like `Qwen3-VL-235B-A22B-Reasoning`.
*   **Image-to-Image Models:** AI Sheets integrates image-to-image models like Qwen-Image-Edit, enabling tasks such as style transfer and image manipulation.
*   **Exporting Data:**  Users can export their transformed datasets as CSV or Parquet files.

### Getting Started and Next Steps

AI Sheets can be used without installation via a web interface. For optimal performance and access to more powerful models, Hugging Face recommends subscribing to PRO and utilizing 20x monthly inference usage.  The project is open-source, and users are encouraged to provide feedback and suggestions on GitHub.

## References

[https://huggingface.co/blog/aisheets-unlock-images](https://huggingface.co/blog/aisheets-unlock-images)