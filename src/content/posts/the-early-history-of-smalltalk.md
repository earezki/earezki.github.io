---
title: 'Best Of: The Early History Of Smalltalk'
pubDate: '2020-04-13 05:49:46 +0100'
categories:
  - Software architecture
  - Software design
  - Thoughts
---

> Smalltalk’s design–and existence–is due to the insight that everything we can describe can be represented by the recursive composition of a single kind of behavioral building block that hides its combination of state and process inside itself and can be dealt with only through the exchange of messages.<br/>
—  **Alan C.Kay**

Kay means that Smalltalk models everything as objects that bundle data (state) and the code that acts on that data (behavior). By forcing interactions to go through message passing, systems become collections of small, well-encapsulated pieces you can assemble and reason about.

---

> each Smalltalk object is a recursion on the entire possibilities of the computer. Thus its semantics are a bit like having thousands and thousands of computer all hooked together by a very fast network.<br/>
—  **Alan C.Kay**

This is a metaphor: every object is a tiny computational unit, and when you combine many of them you can model very complex behavior. Think of simple, identical bricks that, when connected, can build anything — that’s the power Kay describes.

---

> Though it has noble ancestors indeed, Smalltalk’s contribution is anew design paradigm–which I called object-oriented–for attacking large problems of the professional programmer, and making small ones possible for the novice user. Object-oriented design is a successful attempt to qualitatively improve the efficiency of modeling the ever more complex dynamic systems and user relationships made possible by the silicon explosion.<br/>
—  **Alan C.Kay**

---

Here Kay argues that object-oriented programming isn't just syntax or sugar: it’s a different way to think about solving problems. By keeping data with its behavior and favouring message-based interactions, OOP makes large, evolving systems easier to manage and easier to learn for newcomers.

