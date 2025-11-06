---
title: "Voices: Open-Source Text-to-Speech Library for Java Applications"
pubDate: 2025-11-05
description: "Voices is an open-source Java library for generating text-to-speech audio without external APIs. It leverages ONNX Runtime and supports multiple languages via prepackaged models or OpenVoice."
categories: ["AI News", "Java", "Text-to-Speech"]

---

## Voices: Open-Source Text-to-Speech Library for Java Applications

Voices is an open-source text-to-speech (TTS) library designed for Java 17 and newer applications. It eliminates reliance on external APIs or manual software installation, enabling developers to generate multilingual audio files using prepackaged models or OpenVoice. The library was introduced by Henry Coles in September 2025 and reached version 0.0.8 in late October 2025.

---

### Key Features and Technical Implementation

#### 1. **ONNX Runtime Integration**
- **Purpose**: Accelerates model inference using hardware accelerators (CPU/GPU).
- **Support**: Compatible with models from TensorFlow, PyTorch, and other frameworks.
- **Dependencies**:
  - `onnxruntime` (CPU) or `onnxruntime_gpu` (GPU) for model execution.
  - Example: Replace `onnxruntime` with `onnxruntime_gpu` in Maven for GPU acceleration.

#### 2. **Language and Model Support**
- **Prepackaged Models**:
  - **Alba**: English (en_us/en_uk), Dutch (nlNLRonnie), and other languages.
  - **Dictionaries**: `en_uk`, `en_us`, and language-specific phoneme mappings.
  - Example: Use `en_uk` for British English or `en_us` for American English via Maven dependencies.
- **OpenVoice**:
  - **Purpose**: Generates speech without dictionaries, using larger 50 MB models.
  - **Tradeoff**: Higher computational cost compared to 3 MB dictionary files.
  - **Dependency**: `openvoice-phonemizer` for integration.

#### 3. **Code Structure and Usage**
- **Core Class**: `Chorus` manages voice models and resources.
  - **Best Practice**: Use a single `Chorus` instance to avoid repeated model loading.
- **Example: Generating English Audio**
  ```java
  ChorusConfig config = chorusConfig(EnUkDictionary.en_uk());
  try (Chorus chorus = new Chorus(config)) {
    Voice alba = chorus.voice(Alba.albaMedium());
    Audio audio = alba.say("This is the InfoQ article about the Voices library");
    Path path = Paths.get("InfoQ_English");
    audio.save(path);
  }
  ```
- **GPU Support**:
  - Replace `chorusConfig` with `gpuChorusConfig` and use `onnxruntime_gpu`.
  - Example: `ChorusConfig config = gpuChorusConfig(EnUkDictionary.en_uk());`

#### 4. **Markdown Symbol Handling**
- **Automatic Pauses**: Inserts pauses for symbols like `#`, `---`, and em/en dashes.
- **Customization**: Modify pause behavior via `ChorusConfig`.

---

### Use Cases and Developer Insights

#### 1. **Target Use Cases**
- **Fiction Editing Tools**: Original use case for generating natural-sounding speech.
- **Applications Requiring Offline TTS**: Avoids reliance on external APIs.
- **Multilingual Support**: Supports English, Dutch, and other languages via models.

#### 2. **Developer Challenges and Design Decisions**
- **Linguistic Complexity**: Required manual development loop for phoneme conversion due to lack of Java phonemizers.
- **API Simplicity**: Current API prioritizes quick implementation over polish; future improvements aim for cleaner interfaces.
- **Testing Strategy**: Recommends minimal audio output testing, focusing on input validation.

#### 3. **Comparison to Alternatives**
- **Sherpa Onnx** and **MaryTTS** are harder to integrate with Maven or produce lower-quality voices.
- **Voices** offers better Java integration and modern TTS quality via ONNX models.

---

### Future Plans and Recommendations

#### 1. **Planned Enhancements**
- **Improved Pause and Rhythm Control**: For more natural speech pacing.
- **API Refinement**: Streamline the interface for broader usability.

#### 2. **Best Practices**
- **Model Selection**:
  - Use dictionary-based models (`alba`) for lightweight, accurate speech.
  - Opt for `OpenVoice` when dictionaries are unavailable, accepting higher resource usage.
- **GPU Utilization**: Replace `onnxruntime` with `onnxruntime_gpu` for performance-critical applications.
- **Testing**:
  - Validate audio generation with minimal tests.
  - Focus on input boundary checks rather than output accuracy.

#### 3. **Common Pitfalls**
- **Model Size**: `OpenVoice` models are 50 MB; ensure sufficient memory allocation.
- **Dependency Conflicts**: Avoid mixing `onnxruntime` and `onnxruntime_gpu` in the same project.

---

### Working Example

**Generating Dutch Audio with NonEnglishModels**
```java
Model nlModel = NonEnglishModels.nlNLRonnie();
ChorusConfig config = chorusConfig(EnUkDictionary.en_uk());
try (Chorus chorus = new Chorus(config)) {
  Voice alba = chorus.voice(nlModel);
  Audio audio = alba.say("Dit is een Nederlandse tekst Scheveningen");
  Path path = Paths.get("Dutch");
  audio.save(path);
}
```

---

### Recommendations

- **When to Use Voices**:
  - For Java applications needing offline, multilingual TTS.
  - When integrating with build tools like Maven/Gradle.
- **Alternatives**:
  - Use Python-based TTS libraries (e.g., Piper) if Java integration is not required.
- **What to Watch Out For**:
  - Monitor model size and GPU compatibility for large-scale deployments.
  - Test phoneme conversion accuracy for non-English languages.

---

**Reference**: [Voices Text-to-Speech Library on InfoQ](https://www.infoq.com/news/2025/11/voices-text-to-speech/)