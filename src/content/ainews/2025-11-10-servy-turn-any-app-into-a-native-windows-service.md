---
title: "Servy: A Comprehensive Tool for Running Any Application as a Native Windows Service"
pubDate: 2025-11-10
description: "Servy is a modern, open-source tool that enables users to run any application as a native Windows service with advanced features like health checks, logging, and automation support."
categories: ["AI News", "devops", "dotnet", "opensource", "automation", "software", "coding", "development", "engineering"]
---

## Servy: A Modern Solution for Native Windows Service Management

Servy is an open-source tool designed to address the limitations of traditional Windows service management utilities like `sc.exe`, NSSM, and WinSW. It provides a robust, user-friendly interface and scripting capabilities to run any application—Node.js, Python, .NET, or scripts—as a native Windows service, with full control over configuration, monitoring, and automation. Servy combines a desktop GUI, CLI, and PowerShell module, making it suitable for both interactive use and CI/CD pipelines.

---

### Key Features and Capabilities

Servy distinguishes itself through its feature-rich design and flexibility:

- **GUI and CLI Integration**  
  - Clean, intuitive desktop application for service configuration and management.  
  - CLI and PowerShell module for scripting, automation, and CI/CD integration.  
  - Servy Manager app for real-time monitoring of service status, CPU/RAM usage, and logs.

- **Advanced Service Configuration**  
  - Define custom working directories, startup types (Automatic, Manual, Disabled), process priorities, and environment variables.  
  - Support for service accounts: Local System, local user, domain account, or gMSA with AES-encrypted password storage.  
  - Pre-launch and post-launch hooks for environment preparation and post-start actions.

- **Monitoring and Recovery**  
  - Real-time CPU/RAM tracking for installed services.  
  - Health checks, automatic restarts on failure, and recovery actions (restart, stop, or run a failure program).  
  - Stdout/stderr logging with automatic size-based rotation for troubleshooting.

- **Cross-Platform Compatibility**  
  - Works on Windows 7–11 (x64) and Windows Server editions.  
  - Export/import service configurations for easy deployment and backup.

- **Comparison with Alternatives**  
  - **NSSM**: Lacks GUI, health checks, and advanced lifecycle hooks.  
  - **WinSW**: XML-based configuration and no GUI.  
  - **Servy**: Combines GUI, CLI, health monitoring, and advanced automation features in a single tool (MIT license).

---

### Technology Stack and Project Structure

Servy is built using modern .NET technologies and follows Clean Architecture principles:

- **Core Technologies**  
  - **.NET 8.0+** and **.NET Framework 4.8** for compatibility with older systems.  
  - **WPF** for desktop UI, **Windows API** for service management, and **SQLite** for persistent storage.  
  - **Dapper ORM** for efficient database interactions.  

- **Project Structure**  
  The solution comprises 8 main projects:  
  - **Servy**: Main WPF app for service configuration.  
  - **Servy.Manager**: GUI for managing installed services.  
  - **Servy.Service**: Windows Service host for background processes.  
  - **Servy.Core**: Shared business logic and utilities.  
  - **Servy.Infrastructure**: SQLite database and configuration management.  
  - **Servy.CLI**: Command-line interface for automation.  
  - **Servy.Restarter**: Utility for service restarts.  
  - **Servy.UI**: Shared WPF components and utilities.

- **Architecture Layers**  
  - **Presentation Layer**: GUI (Servy, Servy.Manager) and CLI (Servy.CLI).  
  - **Business Logic Layer**: Core service management logic in `Servy.Core`.  
  - **Infrastructure Layer**: SQLite persistence and external integrations in `Servy.Infrastructure`.  
  - **Service Layer**: `Servy.Service` hosts target applications and monitors their lifecycle.

---

### Design Patterns and Development Practices

Servy leverages multiple design patterns for maintainability and scalability:

- **MVVM (Model-View-ViewModel)**: Separates UI logic from business logic in WPF apps.  
- **Factory Method**: Creates service controllers, process wrappers, and repositories dynamically.  
- **Adapter**: Integrates external APIs (e.g., `ServiceControllerWrapper` for .NET `ServiceController`).  
- **Strategy**: Allows interchangeable logging, process handling, and timing strategies.  
- **Observer**: Monitors process events like `OutputDataReceived` and `Exited`.  
- **Dependency Injection**: Loosely couples components via constructor injection.  
- **Repository**: Encapsulates SQLite queries in `Servy.Infrastructure`.

---

### Automation and Testing

Servy includes robust automation and testing frameworks:

- **CI/CD Integration**  
  - GitHub Actions workflows automate builds, testing, and package distribution to WinGet, Chocolatey, and Scoop.  
  - PowerShell scripts handle repetitive tasks like versioning and deployment.  

- **Unit Testing**  
  - Over 22,000 lines of code with comprehensive unit tests across all projects.  
  - Code coverage tracked via Codecov and Coveralls, focusing on `Servy.Core` and `Servy.Infrastructure`.  

---

### Real-World Use Cases

Servy is ideal for scenarios requiring reliable background processes:  
- **Web Servers/Workers**: Keep non-service apps running after reboots.  
- **Automation Scripts**: Schedule and monitor tasks with health checks.  
- **Development Environments**: Run services with custom working directories and environment variables.  
- **Production Systems**: Ensure critical applications restart automatically on failure.

---

### Installation and Usage

Servy can be installed via package managers or manually:  
- **WinGet**:  
  ```bash
  winget install servy
  ```  
- **Chocolatey**:  
  ```bash
  choco install -y servy
  ```  
- **Scoop**:  
  ```bash
  scoop bucket add extras
  scoop install servy
  ```  

Once installed, users can configure services via the GUI, CLI, or PowerShell, with full support for exporting/importing configurations.

---

## Working Example (CLI Usage)

```bash
# Install a service using CLI
servy install --name MyService --path "C:\path\to\app.exe" --dir "C:\myapp" --start automatic
```

**Explanation**:  
- `--name`: Service name.  
- `--path`: Executable path.  
- `--dir`: Custom working directory.  
- `--start`: Startup type (automatic, manual, disabled).  

**Recommendations**:  
- Use `servy manager` for real-time monitoring.  
- For automation, integrate with CI/CD pipelines using PowerShell scripts.  
- Avoid hardcoding paths; use environment variables for flexibility.  

---

## Recommendations

- **When to Use Servy**: Replace NSSM/WinSW in projects requiring advanced monitoring, health checks, or cross-platform compatibility.  
- **Best Practices**:  
  - Always grant full access to `%ProgramData%\Servy` for non-Local System accounts.  
  - Use `servy manager` for centralized service management.  
  - Leverage CLI for scripting and automation in CI/CD workflows.  
- **Pitfalls to Avoid**:  
  - Ensure the target application is compatible with running as a service (e.g., GUI apps may require special handling).  
  - Avoid overloading the system with too many services; monitor resource usage via Servy Manager.  

---

### Reference  
https://dev.to/aelassas/servy-turn-any-app-into-a-native-windows-service-1pco