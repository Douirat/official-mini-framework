# FacileJS Journey

## Introduction

My first interaction with DOM was in the js pool in the beginnig i found the concept of DOM disturbing there is HTMLElements and nearly each HTML tag has it's own type like HTMLBodyElement
Nodes and that you have to create the element using the   `document.createElement(tag)`, then setting the `textContent`, then `className`, and maybe some other attributes. Now you have the element — what’s next? Appending it? and if you have nested elements how many lines we gonna end up with?

Now you’ve just built a layout. But it doesn’t stop there. You still need to update these elements; change `textContent`, toggle class names, reorder them in the DOM, or remove them entirely.

The code keeps growing and maintaining it becomes harder. even the code that you wrote line by line becomes like a stranger. Sure, you can split things into functions, but what about referencing other elements across scopes? You’ll likely end up falling back to `querySelector`, and now the code’s getting even more bloated.

FacileJS is a lightweight basic JavaScript framework, it's a small basic copy of ReactJS that handles states, rounting, rendering and rerendering components using diffing algorithm and other concepts that you will see later in the documentation.

###Example of creating nested elements:
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