---
title: 'React Hooks: UseReducer Generics Params In Typescript'
pubDate: '2020-04-02 05:49:46 +0100'
categories:
  - ReactJS
  - Thoughts
  - Typescript
---

The new React Hooks introduces a lot of functions to encourage the creation of function components.

One of those functions is the ``useReducer``.

```typescript
function useReducer<R extends Reducer<any, any>>(
 reducer: R,
 initialState: ReducerState<R>
): [ReducerState<R>, Dispatch<ReducerAction<R>>];
```

Out of the box, the editor can infer the type of the state when you pass the reduce function. However, when I’ve took the state declaration and put it in an external file, suddenly the editor can no longer infer the type, and my state was of type ``any``.

The solution is simple, you can’t just pass the ``state`` and the ``action`` to the ``useReducer`` generic types, you need to pass a ``React.Reducer``.

```typescript
const [state, dispatch] = 
React.useReducer<React.Reducer<IComponentState, IAction>>(reduceFunction, initialState);
```
