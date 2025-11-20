---
title: "From 20.04 to 24.04 LTS: Safe Ubuntu Upgrade on DigitalOcean"
pubDate: 2025-11-20
description: "A step-by-step guide to upgrading a production Ubuntu server from 20.04 to 24.04 LTS with minimal downtime."
categories: ["AI News", "DevOps", "Ubuntu"]
---

## The Problem

Upgrading legacy production servers is challenging in modern infrastructure, with many preferring containerization. However, sometimes inherited systems require direct OS upgrades, as demonstrated by a recent case involving an Ubuntu 20.04 server with outdated Nginx.

Directly upgrading from Ubuntu 20.04 to 24.04 LTS is not supported, necessitating a multi-step upgrade process to minimize risk and downtime. Outdated OS versions pose significant security risks, as they no longer receive critical security patches, potentially leading to breaches and data loss.

## Key Insights
- **Ubuntu 20.04 End of Life**: Ubuntu 20.04 reached its end of standard support in April 2025.
- **Incremental Upgrades**:  A staged upgrade path (20.04 → 22.10 → 23.04 → 23.10 → 24.04) mitigates risks compared to a direct leap.
- **DigitalOcean Snapshots**: Leveraging DigitalOcean snapshots and Floating IPs enables zero-downtime deployments and easy rollbacks.

### Working Example
```bash
# Upgrade to Ubuntu 22.10
sudo sed -i 's|http://mirrors.digitalocean.com/ubuntu/|http://old-releases.ubuntu.com/ubuntu/|g' /etc/apt/sources.list && \
sudo sed -i 's|http://security.ubuntu.com/ubuntu|http://old-releases.ubuntu.com/ubuntu|g' /etc/apt/sources.list && \
sudo apt update && \
sudo apt upgrade -y && \
sudo apt dist-upgrade -y && \
sudo apt autoremove --purge -y && \
sudo apt install -y ubuntu-release-upgrader-core && \
sudo sed -i 's/kinetic/lunar/g' /etc/apt/sources.list && \
sudo apt update && \
sudo apt upgrade -y && \
sudo apt dist-upgrade -y && \
sudo apt full-upgrade -y && \
sudo apt autoremove --purge -y && \
echo -e "\nUpgrade complete! Rebooting now...\n" && \
sudo reboot
```

```bash
# Upgrade 23.04 → 23.10
sudo sed -i 's|http://old-releases.ubuntu.com/ubuntu|http://old-releases.ubuntu.com/ubuntu|g' /etc/apt/sources.list && \
sudo sed -i 's/lunar/mantic/g' /etc/apt/sources.list && \
sudo apt update && \
sudo apt upgrade -y && \
sudo apt dist-upgrade -y && \
sudo apt full-upgrade -y && \
sudo apt autoremove --purge -y && \
echo -e "\nUpgrade complete! Rebooting now...\n" && \
sudo reboot
```

```bash
# Upgrade 23.10 → 24.04 LTS
sudo sed -i 's|http://old-releases.ubuntu.com/ubuntu|http://archive.ubuntu.com/ubuntu|g' /etc/apt/sources.list && \
sudo sed -i 's/mantic/noble/g' /etc/apt/sources.list && \
sudo apt update && \
sudo apt upgrade -y && \
sudo apt dist-upgrade -y && \
sudo apt full-upgrade -y && \
sudo apt autoremove --purge -y && \
echo -e "\nUpgrade complete! Rebooting now...\n" && \
sudo reboot
```

### Practical Applications
- **Legacy System Maintenance**:  Organizations with older applications not easily containerized can use this method for OS upgrades.
- **Pitfall**: Skipping pre-upgrade backups can lead to significant data loss and prolonged downtime if issues arise during the upgrade process.

**References:**
- https://dev.to/tegos/from-20-to-24-lts-safe-way-to-upgrade-ubuntu-on-digitalocean-4gb