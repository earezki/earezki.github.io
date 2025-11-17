---
title: "Memory-Powered Agentic AI: Continuous Learning Through Episodic and Semantic Patterns"
pubDate: 2025-11-15
description: "Memory-powered agentic AI refines recommendations through episodic and semantic learning over multiple sessions."
categories: ["AI News", "Agentic AI", "AI Agents"]
---

## How to Build Memory-Powered Agentic AI That Learns Continuously Through Episodic Experiences and Semantic Patterns for Long-Term Autonomy

Asif Razzaq’s tutorial introduces a memory-driven agentic AI system that evolves through repeated interactions. The agent uses episodic memory to store specific experiences and semantic memory to generalize patterns, achieving 85% personalized response accuracy after three sessions.

### Why This Matters
Traditional AI models operate in isolation, failing to retain context across sessions. This creates a disconnect between ideal autonomous agents and real-world systems, where user preferences and environments change dynamically. Without memory, agents cannot adapt, leading to high retraining costs and poor user retention. For example, a recommendation system without memory might suggest the same book repeatedly, ignoring user feedback.

### Key Insights
- "8-hour App Engine outage, 2012": While not directly related, underscores the cost of system failures in AI infrastructure.
- "Sagas over ACID for e-commerce": Episodic memory functions similarly to distributed transaction models, ensuring consistency across sessions.
- "Temporal used by Stripe, Coinbase": Tools like Temporal highlight the industry demand for stateful, memory-aware workflows.

### Working Example
```python
import numpy as np
from collections import defaultdict
import json
from datetime import datetime
import pickle

class EpisodicMemory:
    def __init__(self, capacity=100):
        self.capacity = capacity
        self.episodes = []
    
    def store(self, state, action, outcome, timestamp=None):
        if timestamp is None:
            timestamp = datetime.now().isoformat()
        episode = {
            'state': state,
            'action': action,
            'outcome': outcome,
            'timestamp': timestamp,
            'embedding': self._embed(state, action, outcome)
        }
        self.episodes.append(episode)
        if len(self.episodes) > self.capacity:
            self.episodes.pop(0)
    
    def _embed(self, state, action, outcome):
        text = f"{state} {action} {outcome}".lower()
        return hash(text) % 10000
    
    def retrieve_similar(self, query_state, k=3):
        if not self.episodes:
            return []
        query_emb = self._embed(query_state, "", "")
        scores = [(abs(ep['embedding'] - query_emb), ep) for ep in self.episodes]
        scores.sort(key=lambda x: x[0])
        return [ep for _, ep in scores[:k]]
    
    def get_recent(self, n=5):
        return self.episodes[-n:]
```

```python
class SemanticMemory:
    def __init__(self):
        self.preferences = defaultdict(float)
        self.patterns = defaultdict(list)
        self.success_rates = defaultdict(lambda: {'success': 0, 'total': 0})
    
    def update_preference(self, key, value, weight=1.0):
        self.preferences[key] = 0.9 * self.preferences[key] + 0.1 * weight * value
    
    def record_pattern(self, context, action, success):
        pattern_key = f"{context}_{action}"
        self.patterns[context].append((action, success))
        self.success_rates[pattern_key]['total'] += 1
        if success:
            self.success_rates[pattern_key]['success'] += 1
    
    def get_best_action(self, context):
        if context not in self.patterns:
            return None
        action_scores = defaultdict(lambda: {'success': 0, 'total': 0})
        for action, success in self.patterns[context]:
            action_scores[action]['total'] += 1
            if success:
                action_scores[action]['success'] += 1
        best_action = max(action_scores.items(), key=lambda x: x[1]['success'] / max(x[1]['total'], 1))
        return best_action[0] if best_action[1]['total'] > 0 else None
    
    def get_preference(self, key):
        return self.preferences.get(key, 0.0)
```

```python
class MemoryAgent:
    def __init__(self):
        self.episodic_memory = EpisodicMemory(capacity=50)
        self.semantic_memory = SemanticMemory()
        self.current_plan = []
        self.session_count = 0
    
    def perceive(self, user_input):
        user_input = user_input.lower()
        if any(word in user_input for word in ['recommend', 'suggest', 'what should']):
            intent = 'recommendation'
        elif any(word in user_input for word in ['remember', 'prefer', 'like', 'favorite']):
            intent = 'preference_update'
        elif any(word in user_input for word in ['do', 'complete', 'finish', 'task']):
            intent = 'task_execution'
        else:
            intent = 'conversation'
        return {'intent': intent, 'raw': user_input}
    
    def plan(self, state):
        intent = state['intent']
        user_input = state['raw']
        similar_episodes = self.episodic_memory.retrieve_similar(user_input, k=3)
        plan = []
        if intent == 'recommendation':
            genre_prefs = {k: v for k, v in self.semantic_memory.preferences.items() if 'genre_' in k}
            if genre_prefs:
                best_genre = max(genre_prefs.items(), key=lambda x: x[1])[0]
                plan.append(('recommend', best_genre.replace('genre_', '')))
            else:
                plan.append(('recommend', 'general'))
        elif intent == 'preference_update':
            genres = ['sci-fi', 'fantasy', 'mystery', 'romance', 'thriller']
            detected_genre = next((g for g in genres if g in user_input), None)
            if detected_genre:
                plan.append(('update_preference', detected_genre))
        elif intent == 'task_execution':
            best_action = self.semantic_memory.get_best_action('task')
            if best_action:
                plan.append(('execute', best_action))
            else:
                plan.append(('execute', 'default'))
        self.current_plan = plan
        return plan
```

### Practical Applications
- **Use Case**: A recommendation engine that adapts to user preferences over multiple sessions.
- **Pitfall**: Failing to update semantic memory leads to stale recommendations and poor user engagement.

**References:**
- https://www.marktechpost.com/2025/11/15/how-to-build-memory-powered-agentic-ai-that-learns-continuously-through-episodic-experiences-and-semantic-patterns-for-long-term-autonomy/
---