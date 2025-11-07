---
title: "Entendendo o consumo de memória do Gitaly no Kubernetes"
pubDate: 2025-11-07
description: "Este artigo explica como o Gitaly, componente do GitLab, consome memória em ambientes Kubernetes e como o Cgroup v2 resolve problemas de gerenciamento de recursos."
categories: ["AI News", "kubernetes", "gitlab", "devops"]
---

## Entendendo o consumo de memória do Gitaly no Kubernetes

Este artigo aborda o problema de picos de uso de memória no Gitaly, componente do GitLab responsável por operações Git, durante backups em ambientes Kubernetes. O foco é a interação entre o kernel Linux, o Page Cache e os limites de recursos em Cgroup v1, com soluções como o Cgroup v2 para mitigar os riscos de OOM (Out of Memory).

---

### **Gitaly e sua Função no GitLab**

- **Responsabilidade**: Gerencia operações Git (clone, push, pull, diff, etc.) e acesso a repositórios.
- **Arquitetura**:
  - Comunica-se com o GitLab Webservice via gRPC.
  - Armazena repositórios em um Persistent Volume (ex: `/home/git/repos`).
- **Impacto no Kubernetes**:
  - O Gitaly é um pod que pode consumir grandes volumes de memória durante operações como backups.

---

### **GitLab Toolbox Backup e seu Fluxo**

- **Função**: Realiza backups de repositórios Git em ambientes Kubernetes.
- **Processo**:
  - Conecta-se ao Gitaly via gRPC.
  - Solicita backup de repositórios.
  - Recebe bundles Git, processa e comprime os dados.
  - Envia para armazenamento em nuvem (S3, GCS, etc.).
- **Consumo de Memória**:
  - Durante backups, o kernel Linux cacheia arquivos em RAM (Page Cache), causando picos de uso de memória.

---

### **Problemas com Cgroup v1 e o Kernel Linux**

- **Sintomas**:
  - Uso elevado de memória no pod do Gitaly (ex: 37GB após backup).
  - Risco de OOM (Out of Memory) devido a limites de recursos não respeitados.
- **Implicações Críticas**:
  - **Page Cache Global**: O kernel Linux compartilha o cache entre todos os pods no mesmo node.
  - **Limites Ineficazes**: Cgroup v1 limita uso de memória por container, mas o kernel não reconhece pods/containers, levando a inconsistências.
  - **Exemplo de Dados**:
    - `active_file`: 35.6GB (cache ativo de arquivos Git).
    - `rss`: 195MB (memória usada pelo processo Gitaly).
    - `cache total`: 36.2GB (visível para todos os pods).

---

### **Fluxo de Backup e Problemas de Cache**

- **Durante o Backup (1h)**:
  1. Gitaly lê centenas de repositórios.
  2. Kernel cacheia todos os arquivos em RAM (`active_file`).
  3. Backup concluído: Gitaly retorna a 195MB, mas o cache não é limpo.
  4. Kubernetes detecta 37GB de uso, gerando alertas de OOM.
- **Por que o cache não é limpo?**:
  - O kernel marca arquivos como "active" (usados recentemente), assumindo que serão reutilizados.
  - Backup diário não reutiliza os arquivos até o dia seguinte.

---

### **Soluções Propostas**

| Opção               | Esforço     | Benefício                          | Recomendação                |
|---------------------|-------------|------------------------------------|-----------------------------|
| **Migrar para Cgroup v2** | Alto (reboot) | Solução definitiva                 | **Melhor opção a longo prazo** |
| **CronJob privilegiado**  | Baixo (15min) | Resolve o problema imediatamente   | Alternativa rápida          |
| **DaemonSet monitor**     | Médio (1h)  | Limpeza automática do cache        | Opcional                    |
| **Aumentar limite de memória** | Baixo     | Paliativo                          | Somente em emergências      |

---

### **Cgroup v2: Solução Definitiva**

- **Recursos do Cgroup v2**:
  - **PSI (Pressure Stall Information)**: Detecta pressão de memória e libera cache "active" automaticamente.
  - **Estrutura única**: Substitui múltiplas hierarquias de Cgroup v1 por uma árvore unificada.
- **Benefícios**:
  - O kernel libera cache mesmo se for "ativo", evitando OOM.
  - Melhor integração com Kubernetes e containers.
- **Atual Status**:
  - EKS do GitLab ainda usa Cgroup v1, mas a migração é recomendada.

---

### **Referências e Documentação**

- [Artigo original no DEV Community](https://dev.to/camilacodes/entendendo-o-consumo-de-memoria-do-gitaly-no-kubernetes-2ha2)  
- [GitLab Backup Documentation](https://docs.gitlab.com/ee/backup_restore/)  
- [Kernel Tuning for Kubernetes](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html)