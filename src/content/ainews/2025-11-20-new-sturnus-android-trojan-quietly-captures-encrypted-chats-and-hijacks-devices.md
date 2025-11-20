---
title: "Sturnus Android Trojan Captures Encrypted Chats and Enables Device Hijacking"
pubDate: 2025-11-20
description: "The Sturnus Android trojan bypasses encryption to steal chats from WhatsApp, Telegram, and Signal, impacting financial institutions in Southern and Central Europe."
categories: ["AI News", "Cybersecurity", "Mobile Security"]
---

## New Sturnus Android Trojan Quietly Captures Encrypted Chats and Hijacks Devices

The newly discovered Sturnus Android banking trojan exhibits advanced capabilities, including the ability to capture decrypted content from encrypted messaging apps like WhatsApp, Telegram, and Signal, and to fully hijack compromised devices. Currently in an evaluation stage, Sturnus targets financial institutions in Southern and Central Europe, utilizing overlay attacks and sophisticated remote control mechanisms.

### Why This Matters
Current mobile security models often rely on application-level encryption, assuming a secure operating environment. Sturnus circumvents this by exploiting Android's accessibility services and screen capture features *after* decryption, demonstrating a significant gap in protection. The potential for financial loss due to this type of attack is substantial, with targeted fraud impacting numerous users and institutions.

### Key Insights
- **Accessibility Service Abuse**: Sturnus leverages Android's accessibility features for keystroke logging and UI interaction recording.
- **VNC & Screen Mirroring**: The Trojan uses both Virtual Network Computing (VNC) and system display capture for remote device control.
- **Admin Persistence**: Sturnus actively prevents uninstallation by monitoring settings changes and blocking attempts to revoke its administrator privileges.

### Working Example
```python
# Example of how WebSocket communication might be initiated (simplified)
import asyncio
import websockets

async def connect_to_server(uri):
    async with websockets.connect(uri) as websocket:
        name = input("Enter your name: ")
        await websocket.send(name)
        print(f"Sent: {name}")

        greeting = await websocket.recv()
        print(f"Received: {greeting}")

# Replace with the actual C2 server URI
uri = "ws://example.com/sturnus_server"
asyncio.run(connect_to_server(uri))
```

### Practical Applications
- **Financial Institutions**: Banks in Southern and Central Europe need to enhance fraud detection systems to account for compromised mobile devices.
- **Pitfall**: Relying solely on app-level encryption without considering device-level threats like screen capture leaves users vulnerable to sophisticated malware like Sturnus.

**References:**
- https://thehackernews.com/2025/11/new-sturnus-android-trojan-quietly.html