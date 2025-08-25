import { applyEventHandlers } from './event.js';


export const createElement = (tag, props, ...children) => {
  return {
    tag,
    props: props || {},
    children: children.flat(),
  };
};


export const render = (vnode) => {
  // Handle null, undefined, or boolean nodes by returning an empty text node
  if (vnode === null || vnode === undefined || typeof vnode === 'boolean') {
    return document.createTextNode('');
  }

  // Handle primitive nodes (string or number) by returning a text node
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode.toString());
  }

  // Destructure the virtual node object
  const { tag, props, children } = vnode;

  // Create a real DOM element for the given tag
  const element = document.createElement(tag);

  // Attach event handlers from props
  applyEventHandlers(element, props);

  // Set attributes and properties on the element
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on')) continue; // Skip event handlers

    if (key === 'ref' && typeof value === 'function') {
      value(element); // Call ref function with the element
    } else if (key === 'checked' || key === 'value' || key === 'disabled' || key === 'autofocus') {
      element[key] = value; // Set as property
    } else {
      element.setAttribute(key, value); // Set as attribute
    }
  }

  // Recursively render and append children
  for (const child of children) {
    element.appendChild(render(child));
  }

  return element; // Return the real DOM element
};


export const mount = (node, target) => {
  target.innerHTML = '';
  target.appendChild(node);
  return node;
};


function patchProps(el, oldProps, newProps) {
  if (oldProps === newProps) return;
  oldProps = oldProps || {};
  newProps = newProps || {};

  for (const key in newProps) {
    if (newProps.hasOwnProperty(key)) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        if (key.startsWith('on') && typeof newValue === 'function') {
          el[key.toLowerCase()] = newValue;
        } else if (key === 'ref' && typeof newValue === 'function') {
          newValue(el);
        } else if (key === 'checked' || key === 'value' || key === 'disabled' || key === 'autofocus') {
          el[key] = newValue;
        } else if (newValue != null) {
          el.setAttribute(key, newValue);
        }
      }
    }
  }

  for (const key in oldProps) {
    if (oldProps.hasOwnProperty(key) && !newProps.hasOwnProperty(key)) {
      if (key.startsWith('on')) {
        el[key.toLowerCase()] = null;
      } else if (key !== 'ref') {
        el.removeAttribute(key);
      }
    }
  }
}

function patch(parentEl, oldVNode, newVNode, index = 0) {
    // Get the DOM node at the specified index
    const el = parentEl.childNodes[index];

    // If there is no existing DOM node, render and append the new node
    if (!el) {
        parentEl.appendChild(render(newVNode));
        return;
    }

    // Normalize old and new virtual nodes (handle null/boolean)
    const oldV = (oldVNode == null || typeof oldVNode === 'boolean') ? '' : oldVNode;
    const newV = (newVNode == null || typeof newVNode === 'boolean') ? '' : newVNode;

    // Check if either node is a primitive (string, number)
    const oldIsPrimitive = typeof oldV !== 'object';
    const newIsPrimitive = typeof newV !== 'object';

    // If either is primitive, compare their string values and replace if different
    if (oldIsPrimitive || newIsPrimitive) {
        if (String(oldV) !== String(newV)) {
            el.replaceWith(render(newV));
        }
        return;
    }

    // If the tag (element type) has changed, replace the DOM node
    if (oldV.tag !== newV.tag) {
        el.replaceWith(render(newV));
        return;
    }

    // If tags match, update props and children
    patchProps(el, oldV.props, newV.props);      // Update attributes, event handlers, refs
    patchChildren(el, oldV.children, newV.children); // Recursively patch child nodes
}

function patchChildren(parentEl, oldChildren, newChildren) {
    const oldCh = oldChildren.flat();
    const newCh = newChildren.flat();

    const isKeyed = (child) => child?.props?.key !== undefined;

    if (newCh.every(isKeyed) && oldCh.every(isKeyed)) {
        const oldKeyMap = new Map();
        const newKeyMap = new Map();
        const childNodes = parentEl.childNodes;

        oldCh.forEach((child, i) => {
            oldKeyMap.set(child.props.key, { vnode: child, el: childNodes[i], index: i });
        });

        newCh.forEach((child, i) => {
            newKeyMap.set(child.props.key, { vnode: child, index: i });
        });

        oldKeyMap.forEach((oldData, key) => {
            if (!newKeyMap.has(key)) {
                parentEl.removeChild(oldData.el);
            }
        });

        let lastPlacedNode = null;
        for (let i = 0; i < newCh.length; i++) {
            const newVNode = newCh[i];
            const key = newVNode.props.key;
            const existingOld = oldKeyMap.get(key);
            const currentEl = parentEl.childNodes[i] || null;

            if (existingOld) {
                const elToMove = existingOld.el;
                patch(parentEl, existingOld.vnode, newVNode, Array.from(parentEl.childNodes).indexOf(elToMove));
                if (elToMove !== currentEl) {
                    parentEl.insertBefore(elToMove, currentEl);
                }
            } else {
                const newEl = render(newVNode);
                parentEl.insertBefore(newEl, currentEl);
            }
        }
    } else {
        // Fallback for unkeyed children
        const oldLen = oldCh.length;
        const newLen = newCh.length;
        const commonLen = Math.min(oldLen, newLen);

        for (let i = 0; i < commonLen; i++) {
            patch(parentEl, oldCh[i], newCh[i], i);
        }

        if (oldLen > newLen) {
            for (let i = oldLen - 1; i >= newLen; i--) {
                if (parentEl.childNodes[i]) {
                    parentEl.childNodes[i].remove();
                }
            }
        } else if (newLen > oldLen) {
            for (let i = oldLen; i < newLen; i++) {
                parentEl.appendChild(render(newCh[i]));
            }
        }
    }
}

export const createApp = (component, target) => {
    let currentVNode = component();
    let rootNode = render(currentVNode);
    mount(rootNode, target);

    return () => {
        const newVNode = component();
        patch(target, currentVNode, newVNode);
        currentVNode = newVNode;
    };
};