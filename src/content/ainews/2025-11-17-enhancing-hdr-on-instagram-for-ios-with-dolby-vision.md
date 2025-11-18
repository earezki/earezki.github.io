---
title: "Enhancing HDR on Instagram for iOS With Dolby Vision"
pubDate: 2025-11-17
description: "Meta enabled Dolby Vision and ambient viewing environment (amve) on Instagram iOS, resulting in a significantly enhanced HDR viewing experience for users."
categories: ["AI News", "Video Engineering", "iOS"]
---

## How Meta Processes Video

Meta has implemented end-to-end support for Dolby Vision and ambient viewing environment (amve) metadata on Instagram for iOS, becoming the first Meta app to do so. This enhancement addresses a previous limitation where HDR videos lacked full metadata support, impacting picture quality, especially at lower screen brightness levels.

### Why This Matters
Ideal video processing assumes perfect metadata transmission, but real-world systems often discard crucial information like amve and Dolby Vision data due to tooling limitations. This metadata loss resulted in suboptimal HDR viewing experiences, particularly noticeable with iPhone-captured HDR videos, and highlights the cost of delivering a consistently high-quality experience across diverse devices.

### Key Insights
- FFmpeg historically lacked support for amve and Dolby Vision: This was a major bottleneck in Meta’s video processing pipeline.
- Dolby Vision Profile 10 allows metadata carriage within AV1: This enabled Meta to deliver Dolby Vision metadata even without using HEVC.
- A/B testing revealed a 100kbps metadata overhead initially decreased watch time: Demonstrating the importance of optimization even with quality enhancements.

### Working Example
```python
# Example of how FFmpeg is used (conceptual)
# This is a simplified illustration and not directly runnable code
import subprocess

def transcode_video(input_file, output_file):
    """Transcodes a video using FFmpeg with Dolby Vision support."""
    command = [
        'ffmpeg',
        '-i', input_file,
        '-c:v', 'libaom-av1', # Using libaom AV1 encoder
        '-profile:v', '10', # Dolby Vision Profile 10
        '-metadata:s:v:0', 'dolby_vision_profile=10',
        output_file
    ]
    subprocess.run(command)

# Example usage
transcode_video('input.mp4', 'output.mkv')
```

### Practical Applications
- **Instagram**: Improved HDR video viewing experience for iPhone users, leading to increased engagement.
- **Pitfall**: Adding metadata without considering bandwidth constraints can negatively impact user experience and decrease watch time.

**References:**
- https://engineering.fb.com/2025/11/17/ios/enhancing-hdr-on-instagram-for-ios-with-dolby-vision/