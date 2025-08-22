# FacileJS Journey

## Introduction

My first interaction with DOM was in the js pool in the beginnig i found the concept of DOM disturbing there is HTMLElements and nearly each HTML tag has it's own type like HTMLBodyElement
Nodes and that you have to create the element using the   `document.createElement(tag)`, then setting the `textContent`, then `className`, and maybe some other attributes. Now you have the element — what’s next? Appending it? and if you have nested elements how many lines we gonna end up with?

Now you’ve just built a layout. But it doesn’t stop there. You still need to update these elements; change `textContent`, toggle class names, reorder them in the DOM, or remove them entirely.

The code keeps growing and maintaining it becomes harder. even the code that you wrote line by line becomes like a stranger. Sure, you can split things into functions, but what about referencing other elements across scopes? You’ll likely end up falling back to `querySelector`, and now the code’s getting even more bloated.

FacileJS is a lightweight basic JavaScript framework, it's a small basic copy of ReactJS that handles states, rounting, rendering and rerendering components using diffing algorithm and other concepts that you will see later in the documentation.

#### Example of creating nested elements:
```
return FacileJS.createElement('header', { class: 'header' },
    FacileJS.createElement('h1', {}, 'todos'),
    FacileJS.createElement('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true,
      onkeyup: handleKeyDown,
    })
  );
```

in the example above we created an element that has a class with the value header and three children each child has it's own attributes in vanilla js that would have take a lot more time, lines and methodes and that would have been a mess, now all that is possible to be done in less than ten lines


### 1. DOM Abstraction (Virtual DOM)

You describe your UI using `createElement`, a function that returns JavaScript objects called "virtual nodes" (VNodes). The framework's `render` function then turns this virtual representation into real, live DOM elements. On every state change, the application is re-rendered to reflect the new state.

### 2. State Management (Redux-like Store)

The framework provides a single, centralized "store" to hold the entire state of your application. This enables a predictable, one-way data flow: an action is dispatched, a pure "reducer" function calculates the new state, and the UI is re-rendered.

### 3. Event Handling

To meet the project's strict requirement of providing a new way to handle events, this framework **avoids `addEventListener` entirely**. Instead, event handlers are assigned directly to element properties during the rendering process (e.g., `element.onclick = yourFunction`). This is a simple and direct way to handle user interactions.

### 4. Routing System

A simple router uses the `window.onhashchange` property to listen for URL hash changes (e.g., `/#/active`). When the URL changes, the router dispatches an action to the store, allowing the application's state to be synchronized with the URL. This also avoids using `addEventListener`.
