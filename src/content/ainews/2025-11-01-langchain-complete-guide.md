---
title: 'LangChain Complete Guide: Building Production-Ready LLM Applications'
pubDate: '2025-11-01 16:00:00 +0000'
description: 'Master LangChain for building production LLM applications. Learn chains, agents, memory systems, RAG, vector stores, evaluation, and deployment strategies with practical Python examples.'
categories:
  - Python
  - AI
  - LangChain
  - LLM
  - Machine Learning
---

# LangChain Complete Guide: Building Production-Ready LLM Applications

LangChain is the leading framework for building applications with Large Language Models. This comprehensive guide covers everything from basics to production deployment, with real-world examples and best practices.

## Table of Contents

1. [LangChain Fundamentals](#fundamentals)
2. [LLM Integration](#llm-integration)
3. [Prompt Engineering](#prompts)
4. [Chains and LCEL](#chains)
5. [Agents and Tools](#agents)
6. [Memory Systems](#memory)
7. [RAG (Retrieval Augmented Generation)](#rag)
8. [Vector Stores](#vector-stores)
9. [Evaluation and Monitoring](#evaluation)
10. [Production Deployment](#deployment)

## LangChain Fundamentals {#fundamentals}

### 1. Installation and Setup

```python
# Install LangChain and dependencies
pip install langchain langchain-openai langchain-community
pip install chromadb  # Vector store
pip install faiss-cpu  # Alternative vector store
pip install sentence-transformers  # Embeddings

# Basic imports
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

import os
os.environ["OPENAI_API_KEY"] = "your-api-key"
```

### 2. Basic LLM Usage

```python
# Initialize LLM
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0.7,
    max_tokens=500
)

# Simple invocation
response = llm.invoke("What is LangChain?")
print(response.content)

# With message history
messages = [
    SystemMessage(content="You are a helpful AI assistant."),
    HumanMessage(content="What is Python?"),
]
response = llm.invoke(messages)

# Streaming responses
for chunk in llm.stream("Write a poem about coding"):
    print(chunk.content, end="", flush=True)

# Async usage
import asyncio

async def async_generate():
    response = await llm.ainvoke("Tell me a joke")
    return response.content

result = asyncio.run(async_generate())
```

### 3. Core Components Overview

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Prompt Template
prompt = PromptTemplate(
    template="Tell me a {adjective} joke about {topic}",
    input_variables=["adjective", "topic"]
)

# Output Parser
parser = StrOutputParser()

# Chain components together using LCEL
chain = prompt | llm | parser

# Invoke chain
result = chain.invoke({
    "adjective": "funny",
    "topic": "programming"
})
print(result)

# Batch processing
results = chain.batch([
    {"adjective": "funny", "topic": "Python"},
    {"adjective": "silly", "topic": "JavaScript"},
])
```

## LLM Integration {#llm-integration}

### 1. Multiple LLM Providers

```python
# OpenAI
from langchain_openai import ChatOpenAI
openai_llm = ChatOpenAI(model="gpt-4", temperature=0)

# Anthropic Claude
from langchain_anthropic import ChatAnthropic
claude_llm = ChatAnthropic(model="claude-3-opus-20240229")

# Google PaLM
from langchain_google_genai import ChatGoogleGenerativeAI
palm_llm = ChatGoogleGenerativeAI(model="gemini-pro")

# Local models with Ollama
from langchain_community.llms import Ollama
local_llm = Ollama(model="llama2")

# HuggingFace models
from langchain_community.llms import HuggingFaceHub
hf_llm = HuggingFaceHub(
    repo_id="google/flan-t5-xl",
    model_kwargs={"temperature": 0.5}
)

# LLM abstraction for switching providers
class LLMFactory:
    @staticmethod
    def create_llm(provider: str, **kwargs):
        providers = {
            "openai": ChatOpenAI,
            "anthropic": ChatAnthropic,
            "google": ChatGoogleGenerativeAI,
            "ollama": Ollama,
        }
        
        llm_class = providers.get(provider)
        if not llm_class:
            raise ValueError(f"Unknown provider: {provider}")
        
        return llm_class(**kwargs)

# Usage
llm = LLMFactory.create_llm(
    "openai",
    model="gpt-4",
    temperature=0
)
```

### 2. Token Management and Cost Optimization

```python
from langchain.callbacks import get_openai_callback
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-3.5-turbo")

# Track token usage and cost
with get_openai_callback() as cb:
    result = llm.invoke("Write a long story about AI")
    print(f"Total Tokens: {cb.total_tokens}")
    print(f"Prompt Tokens: {cb.prompt_tokens}")
    print(f"Completion Tokens: {cb.completion_tokens}")
    print(f"Total Cost (USD): ${cb.total_cost}")

# Token counting
from tiktoken import encoding_for_model

def count_tokens(text: str, model: str = "gpt-4") -> int:
    encoding = encoding_for_model(model)
    return len(encoding.encode(text))

text = "Hello, how are you?"
tokens = count_tokens(text)
print(f"Tokens: {tokens}")

# Cost estimation before API call
def estimate_cost(prompt: str, max_tokens: int = 500) -> float:
    input_tokens = count_tokens(prompt)
    total_tokens = input_tokens + max_tokens
    
    # GPT-4 pricing (example)
    cost_per_1k = 0.03  # Input
    return (total_tokens / 1000) * cost_per_1k

estimated = estimate_cost("Write a detailed analysis...")
print(f"Estimated cost: ${estimated:.4f}")
```

## Prompt Engineering {#prompts}

### 1. Prompt Templates

```python
from langchain_core.prompts import (
    ChatPromptTemplate,
    PromptTemplate,
    FewShotPromptTemplate,
    MessagesPlaceholder
)

# Simple prompt template
simple_prompt = PromptTemplate(
    template="What is the capital of {country}?",
    input_variables=["country"]
)

# Chat prompt template
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {role} expert."),
    ("user", "{question}")
])

chain = chat_prompt | llm | StrOutputParser()
result = chain.invoke({
    "role": "Python programming",
    "question": "What are decorators?"
})

# Few-shot prompting
examples = [
    {
        "input": "happy",
        "output": "sad"
    },
    {
        "input": "tall",
        "output": "short"
    },
    {
        "input": "hot",
        "output": "cold"
    }
]

example_prompt = PromptTemplate(
    template="Input: {input}\nOutput: {output}",
    input_variables=["input", "output"]
)

few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="Give the opposite of every word:",
    suffix="Input: {word}\nOutput:",
    input_variables=["word"]
)

# Dynamic few-shot with example selector
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_community.vectorstores import Chroma

example_selector = SemanticSimilarityExampleSelector.from_examples(
    examples,
    OpenAIEmbeddings(),
    Chroma,
    k=2  # Select 2 most similar examples
)

dynamic_prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=example_prompt,
    prefix="Give the opposite:",
    suffix="Input: {word}\nOutput:",
    input_variables=["word"]
)
```

### 2. Advanced Prompt Techniques

```python
# Chain of Thought prompting
cot_prompt = ChatPromptTemplate.from_template("""
Solve this problem step by step:

Problem: {problem}

Let's approach this systematically:
1. Understand the problem
2. Break it down into steps
3. Solve each step
4. Provide the final answer

Solution:
""")

# Self-consistency prompting
async def self_consistency(question: str, n: int = 5) -> str:
    """Generate multiple responses and pick most common"""
    responses = await asyncio.gather(*[
        llm.ainvoke(question) for _ in range(n)
    ])
    
    # Find most common response (simplified)
    from collections import Counter
    answers = [r.content for r in responses]
    most_common = Counter(answers).most_common(1)[0][0]
    return most_common

# ReAct prompting (Reasoning + Acting)
react_prompt = ChatPromptTemplate.from_template("""
Answer the following question using this format:

Thought: Think about what to do
Action: The action to take
Observation: The result of the action
... (repeat Thought/Action/Observation as needed)
Thought: Final conclusion
Answer: The final answer

Question: {question}
""")

# Prompt with output structuring
structured_prompt = ChatPromptTemplate.from_template("""
Extract information from the text and return as JSON:

Text: {text}

Return JSON with these fields:
- name: Person's name
- age: Person's age  
- occupation: Person's occupation
- location: Person's location

JSON:
""")

from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser()
chain = structured_prompt | llm | parser

result = chain.invoke({
    "text": "John Smith is a 35-year-old software engineer living in San Francisco."
})
print(result)  # {"name": "John Smith", "age": 35, ...}
```

## Chains and LCEL {#chains}

### 1. LangChain Expression Language (LCEL)

```python
from langchain_core.runnables import (
    RunnablePassthrough,
    RunnableParallel,
    RunnableLambda
)

# Basic chain
prompt = ChatPromptTemplate.from_template("Tell me about {topic}")
chain = prompt | llm | StrOutputParser()

# Chain with intermediate steps
def extract_keywords(text: str) -> list[str]:
    # Extract keywords from text
    return text.lower().split()[:3]

keyword_chain = (
    prompt
    | llm
    | StrOutputParser()
    | RunnableLambda(extract_keywords)
)

keywords = keyword_chain.invoke({"topic": "Python programming"})

# Parallel execution
parallel_chain = RunnableParallel({
    "summary": prompt | llm | StrOutputParser(),
    "keywords": keyword_chain,
    "length": RunnableLambda(lambda x: len(x["topic"]))
})

results = parallel_chain.invoke({"topic": "Machine Learning"})

# Branching chain
def route_question(input_dict):
    question = input_dict["question"]
    if "python" in question.lower():
        return "python_chain"
    return "general_chain"

python_prompt = ChatPromptTemplate.from_template(
    "As a Python expert: {question}"
)
general_prompt = ChatPromptTemplate.from_template(
    "Answer: {question}"
)

branch_chain = {
    "python_chain": python_prompt | llm,
    "general_chain": general_prompt | llm
}

# Conditional routing
from langchain_core.runnables import RunnableBranch

conditional_chain = RunnableBranch(
    (lambda x: "python" in x["question"].lower(), python_prompt | llm),
    (lambda x: "javascript" in x["question"].lower(), general_prompt | llm),
    general_prompt | llm  # default
)
```

### 2. Complex Chains

```python
# Map-Reduce chain for document summarization
from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain.chains import MapReduceDocumentsChain

# Map step: Summarize each document
map_prompt = ChatPromptTemplate.from_template(
    "Summarize this document:\n\n{page_content}"
)
map_chain = map_prompt | llm | StrOutputParser()

# Reduce step: Combine summaries
reduce_prompt = ChatPromptTemplate.from_template(
    "Combine these summaries into a final summary:\n\n{summaries}"
)
reduce_chain = reduce_prompt | llm | StrOutputParser()

# Sequential chain with multiple steps
from langchain.chains import SequentialChain

# Step 1: Generate outline
outline_chain = (
    ChatPromptTemplate.from_template("Create an outline for: {topic}")
    | llm
    | StrOutputParser()
)

# Step 2: Write content based on outline
content_chain = (
    ChatPromptTemplate.from_template(
        "Write content for this outline:\n{outline}"
    )
    | llm
    | StrOutputParser()
)

# Combine steps
full_chain = outline_chain | content_chain

# Transform chain for data processing
from langchain.schema import Document

def load_documents() -> list[Document]:
    return [
        Document(page_content="Document 1 content"),
        Document(page_content="Document 2 content"),
    ]

# Process each document
process_chain = (
    RunnableLambda(load_documents)
    | RunnableLambda(lambda docs: [
        (map_prompt | llm).invoke({"page_content": doc.page_content})
        for doc in docs
    ])
)
```

## Agents and Tools {#agents}

### 1. Creating Custom Tools

```python
from langchain.tools import Tool, StructuredTool
from langchain_core.tools import tool
from pydantic import BaseModel, Field

# Simple function tool
def search_api(query: str) -> str:
    """Search the internet for information"""
    # Implement actual search logic
    return f"Search results for: {query}"

search_tool = Tool(
    name="Search",
    func=search_api,
    description="Searches the internet for information"
)

# Decorator-based tool
@tool
def calculator(expression: str) -> float:
    """Evaluates mathematical expressions"""
    try:
        return eval(expression)
    except Exception as e:
        return f"Error: {str(e)}"

# Structured tool with typed inputs
class CalculatorInput(BaseModel):
    a: float = Field(description="First number")
    b: float = Field(description="Second number")
    operation: str = Field(description="Operation: add, subtract, multiply, divide")

def calculator_func(a: float, b: float, operation: str) -> float:
    operations = {
        "add": a + b,
        "subtract": a - b,
        "multiply": a * b,
        "divide": a / b if b != 0 else float('inf')
    }
    return operations.get(operation, 0)

structured_calc = StructuredTool.from_function(
    func=calculator_func,
    name="Calculator",
    description="Performs basic arithmetic",
    args_schema=CalculatorInput
)

# Tool from API
import requests

def weather_tool(city: str) -> str:
    """Get current weather for a city"""
    # Replace with actual API call
    response = requests.get(
        f"https://api.weather.com/v1/current?city={city}"
    )
    return response.json()

weather = Tool.from_function(
    func=weather_tool,
    name="Weather",
    description="Gets current weather for a city"
)
```

### 2. Agent Types and Usage

```python
from langchain.agents import (
    create_openai_functions_agent,
    create_react_agent,
    AgentExecutor,
    Tool
)
from langchain.agents import load_tools

# Load built-in tools
tools = load_tools(
    ["serpapi", "llm-math"],
    llm=llm
)

# Custom tools
custom_tools = [search_tool, calculator, weather]
all_tools = tools + custom_tools

# OpenAI Functions Agent
from langchain import hub

prompt = hub.pull("hwchase17/openai-functions-agent")
agent = create_openai_functions_agent(llm, all_tools, prompt)

agent_executor = AgentExecutor(
    agent=agent,
    tools=all_tools,
    verbose=True,
    max_iterations=10,
    handle_parsing_errors=True
)

# Run agent
result = agent_executor.invoke({
    "input": "What's the weather in Paris and what's 25 + 37?"
})

# ReAct Agent (Reasoning + Acting)
react_prompt = hub.pull("hwchase17/react")
react_agent = create_react_agent(llm, all_tools, react_prompt)

react_executor = AgentExecutor(
    agent=react_agent,
    tools=all_tools,
    verbose=True
)

# Conversational Agent with memory
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

conversational_agent = AgentExecutor(
    agent=agent,
    tools=all_tools,
    memory=memory,
    verbose=True
)

# Multi-step agent execution
response1 = conversational_agent.invoke({
    "input": "My name is John"
})

response2 = conversational_agent.invoke({
    "input": "What's my name?"
})  # Agent remembers: "John"
```

### 3. Custom Agent Implementation

```python
from langchain.agents import BaseSingleActionAgent
from langchain.schema import AgentAction, AgentFinish

class CustomAgent(BaseSingleActionAgent):
    tools: list[Tool]
    llm: ChatOpenAI
    
    @property
    def input_keys(self):
        return ["input"]
    
    def plan(
        self,
        intermediate_steps: list,
        **kwargs
    ) -> AgentAction | AgentFinish:
        # Custom planning logic
        user_input = kwargs["input"]
        
        # Decide which tool to use
        if "weather" in user_input.lower():
            return AgentAction(
                tool="Weather",
                tool_input=user_input,
                log="Using weather tool"
            )
        elif "calculate" in user_input.lower():
            return AgentAction(
                tool="Calculator",
                tool_input=user_input,
                log="Using calculator"
            )
        else:
            return AgentFinish(
                return_values={"output": "I don't know how to help with that"},
                log="No suitable tool found"
            )
    
    async def aplan(
        self,
        intermediate_steps: list,
        **kwargs
    ) -> AgentAction | AgentFinish:
        return self.plan(intermediate_steps, **kwargs)

# Use custom agent
custom_agent = CustomAgent(tools=custom_tools, llm=llm)
custom_executor = AgentExecutor(agent=custom_agent, tools=custom_tools)
```

## Memory Systems {#memory}

### 1. Memory Types

```python
from langchain.memory import (
    ConversationBufferMemory,
    ConversationBufferWindowMemory,
    ConversationSummaryMemory,
    ConversationKGMemory,
    VectorStoreRetrieverMemory
)

# Buffer memory - stores all messages
buffer_memory = ConversationBufferMemory()
buffer_memory.save_context(
    {"input": "Hi, I'm John"},
    {"output": "Hello John! How can I help you?"}
)

# Window memory - keeps last K messages
window_memory = ConversationBufferWindowMemory(k=5)

# Summary memory - summarizes old conversations
summary_memory = ConversationSummaryMemory(llm=llm)

# Knowledge graph memory - extracts entities and relationships
kg_memory = ConversationKGMemory(llm=llm)

# Vector store memory - uses similarity search
from langchain_community.vectorstores import Chroma

embeddings = OpenAIEmbeddings()
vector_store = Chroma(embedding_function=embeddings)

vector_memory = VectorStoreRetrieverMemory(
    retriever=vector_store.as_retriever(search_kwargs={"k": 3})
)

# Add memories
vector_memory.save_context(
    {"input": "I love programming"},
    {"output": "That's great! What languages?"}
)
```

### 2. Memory in Chains

```python
# Chain with memory
from langchain.chains import ConversationChain

conversation = ConversationChain(
    llm=llm,
    memory=buffer_memory,
    verbose=True
)

# Conversation maintains context
response1 = conversation.predict(input="Hi, I'm Alice")
response2 = conversation.predict(input="What's my name?")
# Response: "Your name is Alice"

# Custom memory implementation
class CustomMemory(ConversationBufferMemory):
    def save_context(self, inputs: dict, outputs: dict):
        # Custom logic before saving
        # E.g., filter sensitive information
        filtered_inputs = self._filter_sensitive(inputs)
        super().save_context(filtered_inputs, outputs)
    
    def _filter_sensitive(self, inputs: dict) -> dict:
        # Remove credit card numbers, etc.
        return inputs

# Memory with multiple stores
from langchain.memory import CombinedMemory

# Short-term memory
short_term = ConversationBufferWindowMemory(k=5)

# Long-term memory  
long_term = VectorStoreRetrieverMemory(
    retriever=vector_store.as_retriever()
)

# Combine memories
combined_memory = CombinedMemory(memories=[short_term, long_term])
```

## RAG (Retrieval Augmented Generation) {#rag}

### 1. Basic RAG Implementation

```python
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    WebBaseLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Load documents
loader = PyPDFLoader("document.pdf")
documents = loader.load()

# Split documents
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
)
splits = text_splitter.split_documents(documents)

# Create embeddings and vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings
)

# Create retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)

# RAG prompt
rag_prompt = ChatPromptTemplate.from_template("""
Answer the question based only on the following context:

{context}

Question: {question}

Answer:
""")

# Format documents
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Create RAG chain
rag_chain = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough()
    }
    | rag_prompt
    | llm
    | StrOutputParser()
)

# Query
answer = rag_chain.invoke("What is the main topic of the document?")
```

### 2. Advanced RAG Techniques

```python
# Multi-query retrieval
from langchain.retrievers.multi_query import MultiQueryRetriever

multi_query_retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm
)

# Generates multiple queries and retrieves for each
results = multi_query_retriever.get_relevant_documents(
    "Tell me about climate change"
)

# Contextual compression
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(llm)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever()
)

# Returns only relevant parts of documents
compressed_docs = compression_retriever.get_relevant_documents(
    "What is Python?"
)

# Parent document retrieval
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore

# Store for parent documents
store = InMemoryStore()

# Small chunks for retrieval
child_splitter = RecursiveCharacterTextSplitter(chunk_size=400)

# Larger chunks for context
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000)

parent_retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=store,
    child_splitter=child_splitter,
    parent_splitter=parent_splitter,
)

# Hybrid search (keyword + semantic)
from langchain.retrievers import BM25Retriever, EnsembleRetriever

# Keyword-based retriever
bm25_retriever = BM25Retriever.from_documents(splits)
bm25_retriever.k = 3

# Semantic retriever
semantic_retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Combine both
ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, semantic_retriever],
    weights=[0.5, 0.5]
)

# Self-query retriever with metadata
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo

metadata_field_info = [
    AttributeInfo(
        name="category",
        description="The category of the document",
        type="string"
    ),
    AttributeInfo(
        name="year",
        description="The year the document was written",
        type="integer"
    ),
]

document_content_description = "Technical documentation"

self_query_retriever = SelfQueryRetriever.from_llm(
    llm,
    vectorstore,
    document_content_description,
    metadata_field_info,
    verbose=True
)

# Query with metadata filter
docs = self_query_retriever.get_relevant_documents(
    "Documents about Python from 2023"
)
```

## Vector Stores {#vector-stores}

### 1. Vector Store Options

```python
# Chroma (local)
from langchain_community.vectorstores import Chroma

chroma_db = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# FAISS (local, fast)
from langchain_community.vectorstores import FAISS

faiss_db = FAISS.from_documents(splits, embeddings)
faiss_db.save_local("faiss_index")

# Load existing index
loaded_db = FAISS.load_local("faiss_index", embeddings)

# Pinecone (cloud)
from langchain_community.vectorstores import Pinecone
import pinecone

pinecone.init(api_key="your-key", environment="us-west1-gcp")

pinecone_db = Pinecone.from_documents(
    splits,
    embeddings,
    index_name="my-index"
)

# Weaviate (cloud/self-hosted)
from langchain_community.vectorstores import Weaviate
import weaviate

client = weaviate.Client(url="http://localhost:8080")

weaviate_db = Weaviate.from_documents(
    splits,
    embeddings,
    client=client,
    by_text=False
)

# Qdrant (cloud/self-hosted)
from langchain_community.vectorstores import Qdrant

qdrant_db = Qdrant.from_documents(
    splits,
    embeddings,
    url="http://localhost:6333",
    collection_name="my_documents"
)
```

### 2. Vector Store Operations

```python
# Add documents
new_docs = text_splitter.create_documents([
    "New document content",
    "Another document"
])
vectorstore.add_documents(new_docs)

# Similarity search
results = vectorstore.similarity_search(
    "What is machine learning?",
    k=5
)

# Similarity search with scores
results_with_scores = vectorstore.similarity_search_with_score(
    "Python programming",
    k=3
)

for doc, score in results_with_scores:
    print(f"Score: {score}")
    print(f"Content: {doc.page_content[:100]}...")

# MMR (Maximal Marginal Relevance) search
# Returns diverse results
mmr_results = vectorstore.max_marginal_relevance_search(
    "Python",
    k=5,
    fetch_k=20  # Fetch more, return diverse subset
)

# Metadata filtering
filtered_results = vectorstore.similarity_search(
    "Python tutorial",
    k=5,
    filter={"category": "programming", "year": 2023}
)

# Delete documents
vectorstore.delete(ids=["doc_id_1", "doc_id_2"])

# Update documents
vectorstore.update_document(
    document_id="doc_id",
    document=new_document
)
```

## Evaluation and Monitoring {#evaluation}

### 1. Evaluating RAG Systems

```python
from langchain.evaluation import (
    load_evaluator,
    EvaluatorType
)

# Question-Answer evaluation
qa_evaluator = load_evaluator("qa")

eval_result = qa_evaluator.evaluate_strings(
    prediction="Paris is the capital of France",
    input="What is the capital of France?",
    reference="Paris"
)

# Criteria-based evaluation
criteria_evaluator = load_evaluator(
    "criteria",
    criteria="conciseness"
)

eval_result = criteria_evaluator.evaluate_strings(
    prediction="The answer is very long and verbose...",
    input="What is 2+2?"
)

# Custom evaluation
from langchain.evaluation import StringEvaluator

class CustomEvaluator(StringEvaluator):
    def _evaluate_strings(
        self,
        prediction: str,
        reference: str = None,
        input: str = None,
        **kwargs
    ) -> dict:
        # Custom evaluation logic
        score = len(prediction) < 100  # Example: brevity
        return {
            "score": int(score),
            "reasoning": "Response is concise" if score else "Too long"
        }

# RAG evaluation metrics
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)

# Prepare evaluation dataset
eval_dataset = {
    "question": ["What is Python?"],
    "answer": ["Python is a programming language"],
    "contexts": [["Python is a high-level programming language..."]],
    "ground_truths": [["Python is a programming language"]]
}

# Evaluate
result = evaluate(
    eval_dataset,
    metrics=[
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall
    ]
)

print(result)
```

### 2. Monitoring and Logging

```python
from langchain.callbacks import StdOutCallbackHandler
from langchain.callbacks.tracers import LangChainTracer

# Stdout logging
handler = StdOutCallbackHandler()

chain = prompt | llm | StrOutputParser()
result = chain.invoke(
    {"input": "Hello"},
    config={"callbacks": [handler]}
)

# LangSmith tracing
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-key"

tracer = LangChainTracer()

result = chain.invoke(
    {"input": "Hello"},
    config={"callbacks": [tracer]}
)

# Custom callback
from langchain.callbacks.base import BaseCallbackHandler

class CustomCallback(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(f"LLM started with prompts: {prompts}")
    
    def on_llm_end(self, response, **kwargs):
        print(f"LLM ended with response: {response}")
    
    def on_llm_error(self, error, **kwargs):
        print(f"LLM error: {error}")
    
    def on_chain_start(self, serialized, inputs, **kwargs):
        print(f"Chain started with inputs: {inputs}")
    
    def on_chain_end(self, outputs, **kwargs):
        print(f"Chain ended with outputs: {outputs}")

custom_callback = CustomCallback()

# Token counting callback
class TokenCountCallback(BaseCallbackHandler):
    def __init__(self):
        self.total_tokens = 0
        self.prompt_tokens = 0
        self.completion_tokens = 0
    
    def on_llm_end(self, response, **kwargs):
        if hasattr(response, "llm_output"):
            token_usage = response.llm_output.get("token_usage", {})
            self.total_tokens += token_usage.get("total_tokens", 0)
            self.prompt_tokens += token_usage.get("prompt_tokens", 0)
            self.completion_tokens += token_usage.get("completion_tokens", 0)

token_counter = TokenCountCallback()
result = chain.invoke(
    {"input": "Hello"},
    config={"callbacks": [token_counter]}
)

print(f"Total tokens used: {token_counter.total_tokens}")
```

## Production Deployment {#deployment}

### 1. FastAPI Integration

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

app = FastAPI(title="LangChain API")

# Initialize LLM and chain
llm = ChatOpenAI(model="gpt-3.5-turbo")
prompt = ChatPromptTemplate.from_template("Answer: {question}")
chain = prompt | llm | StrOutputParser()

# Request model
class QuestionRequest(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str

@app.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    try:
        answer = await chain.ainvoke({"question": request.question})
        return AnswerResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# RAG endpoint
@app.post("/rag")
async def rag_query(request: QuestionRequest):
    try:
        # Use RAG chain
        answer = await rag_chain.ainvoke(request.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check
@app.get("/health")
async def health():
    return {"status": "healthy"}

# Run with: uvicorn main:app --reload
```

### 2. Caching and Optimization

```python
from langchain.cache import InMemoryCache, SQLiteCache
from langchain.globals import set_llm_cache
import langchain

# In-memory cache
set_llm_cache(InMemoryCache())

# SQLite cache (persistent)
set_llm_cache(SQLiteCache(database_path=".langchain.db"))

# Redis cache
from langchain.cache import RedisCache
import redis

redis_client = redis.Redis(host='localhost', port=6379)
set_llm_cache(RedisCache(redis_client))

# Semantic cache
from langchain.cache import RedisSemanticCache

set_llm_cache(
    RedisSemanticCache(
        redis_url="redis://localhost:6379",
        embedding=OpenAIEmbeddings()
    )
)

# Rate limiting
from langchain_core.runnables import RateLimiter

rate_limiter = RateLimiter(
    requests_per_second=10,
    check_every_n_seconds=1
)

rate_limited_chain = rate_limiter | chain

# Batch processing
async def process_batch(questions: list[str]):
    results = await chain.abatch(
        [{"question": q} for q in questions],
        config={"max_concurrency": 5}
    )
    return results

# Retry logic
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
async def resilient_invoke(question: str):
    return await chain.ainvoke({"question": question})
```

### 3. Production Best Practices

```python
import structlog
from prometheus_client import Counter, Histogram
import time

# Structured logging
logger = structlog.get_logger()

# Metrics
request_counter = Counter(
    'langchain_requests_total',
    'Total LangChain requests'
)
request_duration = Histogram(
    'langchain_request_duration_seconds',
    'Request duration'
)

# Production-ready chain wrapper
class ProductionChain:
    def __init__(self, chain):
        self.chain = chain
        self.logger = structlog.get_logger()
    
    async def invoke(self, input_data: dict) -> str:
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        try:
            self.logger.info(
                "chain_started",
                request_id=request_id,
                input_data=input_data
            )
            
            result = await self.chain.ainvoke(input_data)
            
            duration = time.time() - start_time
            request_counter.inc()
            request_duration.observe(duration)
            
            self.logger.info(
                "chain_completed",
                request_id=request_id,
                duration=duration
            )
            
            return result
            
        except Exception as e:
            self.logger.error(
                "chain_failed",
                request_id=request_id,
                error=str(e)
            )
            raise

# Environment-specific configuration
import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    model_name: str = "gpt-3.5-turbo"
    temperature: float = 0.7
    max_tokens: int = 500
    redis_url: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"

settings = Settings()

# Initialize with settings
llm = ChatOpenAI(
    api_key=settings.openai_api_key,
    model=settings.model_name,
    temperature=settings.temperature,
    max_tokens=settings.max_tokens
)
```

## Conclusion

LangChain enables building powerful LLM applications. Key takeaways:

1. **Start Simple** - Begin with basic chains, add complexity gradually
2. **Use RAG** - Enhance responses with relevant context
3. **Implement Agents** - Let LLMs use tools intelligently
4. **Evaluate Rigorously** - Test quality with proper metrics
5. **Monitor Production** - Track usage, costs, and performance

**Remember**: Building with LLMs is iterative - experiment, evaluate, refine.

## Resources

- [LangChain Documentation](https://python.langchain.com/)
- [LangChain Cookbook](https://github.com/langchain-ai/langchain/tree/master/cookbook)
- [LangSmith](https://smith.langchain.com/) - Monitoring platform
- [LangChain Hub](https://smith.langchain.com/hub) - Prompt templates

---

*What LangChain patterns work best for your use case? Share your experience!*
