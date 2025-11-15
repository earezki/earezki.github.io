---
title: "Optimize ClamAV Scans on 4GB RAM Servers Without Crashes"
pubDate: 2025-11-15
description: "Optimize ClamAV scans on 4GB RAM servers with clamd and proper tuning to prevent crashes."
categories: ["AI News", "DevOps", "Security"]
---

## How to Run Efficient ClamAV Scans on a 4GB RAM Server (Without Killing Your Machine)

ClamAV's default `clamscan` tool causes server freezes on 4GB RAM systems by loading 600MB–900MB of virus databases into memory repeatedly. The fix involves switching to `clamd + clamdscan` with low-RAM configurations.

### Why This Matters
The ideal model assumes infinite resources, but real-world 4GB servers face severe constraints. Repeatedly loading ClamAV's database with `clamscan` spikes RAM usage to 900MB per scan, risking server crashes. This approach is unsustainable for low-memory environments, where even a 20% RAM spike can destabilize services.

### Key Insights
- "ClamAV's `clamscan` loads 600MB–900MB of virus databases per scan (Maneshwar, 2025)"
- "Use `clamd + clamdscan` for persistent, low-RAM scanning (context)"
- "ClamAV daemon (`clamd`) used by VPS admins to avoid memory spikes (context)"

### Working Example
```bash
# 1. Install ClamAV Daemon
sudo apt update
sudo apt install clamav-daemon
```

```bash
# 2. Configure clamd.conf
echo "MaxThreads 1" | sudo tee -a /etc/clamav/clamd.conf
echo "ExitOnOOM yes" | sudo tee -a /etc/clamav/clamd.conf
echo "ScanOnAccess no" | sudo tee -a /etc/clamav/clamd.conf
```

```bash
# 3. Configure freshclam.conf
echo "Checks 1" | sudo tee -a /etc/clamav/freshclam.conf
```

```bash
# 4. Run scan with clamdscan
sudo systemctl start clamav-daemon
sleep 20
sudo clamdscan --multiscan --fdpass --move=/var/quarantine /
sudo systemctl stop clamav-daemon
```

### Practical Applications
- **Use Case**: VPS administrators using `clamd + clamdscan` for nightly scans on 4GB RAM servers
- **Pitfall**: Running `clamscan` continuously leads to server freezes due to repeated database loads

**References:**
- https://dev.to/lovestaco/how-to-run-efficient-clamav-scans-on-a-4gb-ram-server-without-killing-your-machine-14
---