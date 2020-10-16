# Reakt Workshop - building React with Vanilla JavaScript

In the following, we want to build `React` from scratch by using Vanilla JavaScript. 
We will name this clone `Reakt`.
Of course all our approaches are not one-to-one implementations of the React library.
But building it from scratch should provide a deeper understanding of what `React` is doing under the hood.
In most cases it seems to be much more complicated than it really is. 

We will start by creating some boilerplate code needed to serve an application via localhost.
Afterwards concepts for creating and rendering `ReaktElements` are shown and support for props is added. 
This includes not only basic props, but also rendering child elements as well as implementing event handling.
We will also support functional components. The concept of hooks is illustrated by implementing `useState` and `useEffect`.

## Steps

Each step for building `React` with Vanilla JavaScript is illustrated by an example. 
Corresponding code snippets are added so that it should be easier to follow. 

So let's start building!

### 1. Create boilerplate code

- Create a folder for your project e.g. called `reakt` 
- Create an index.html file in the root of your project
- Open that file in your IDE of choice
- Type `!` and than the tab key of your keyboard to create a html template in that file (works in almost every IDE). If this is not working, use this template for example: 
    ```html
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
    
    </body>
    </html>
    ```
- Add a root element to your DOMs body:
    ```html
      <body>
          <div id="root"></div>
      </body>
    ```
- Create an `index.js` file and use a `console.log('Hello Reakt')` inside this file
- Use this index.js file in your html:
    ```html
      <body>
          <div id="root"></div>
          <!-- can use es6 modules in vanilla js by using module -> e.g. imports -->
          <script type="module" src="index.js"></script>
      </body>
    ```
    You can use es6 modules in Vanilla JavaScript by using `type="module"` in your script tag.
- Test if everything works when serving the files via localhost:
    - if you use PHPStorm, you can right click on the `index.html` file and choose `Open in Browser`. It automatically creates a localhost http server for you.
    - otherwise e.g. install `http-serve` via yarn package manager: `yarn global add http-server`
    - you should see your log message in the console of your browser
    
### 2. render your first element in Reakt

- Create a `reakt.js` file

- Declarate a function called `createElement` which accepts a `type` parameter:
    ```javascript
    export function createElement(type) {
        const reaktElement = {
            type,
        }
        return reaktElement
    }
    ```
  
- Create a `reakt-dom.js` file

- ReaktDOM needs to have a `renderElement` function to create dom elements out of `ReaktElements` which are just plain JavaScript objects:
    ```javascript
    function renderElement(reaktElement) {
        const { type } = reaktElement
    
        if (typeof type === 'string') {
            const domElement = document.createElement(type)
            return domElement
        }
    }
    ```
  
- Moreover we need a `render` function in `reakt-dom` to be able to render our application:
    ```javascript
    export function render(reaktElement, domElement) {
        const app = renderElement(reaktElement)
        domElement.appendChild(app)
    }
    ```
  
- Now, we can use our `render` function from `reakt-dom` in our `index.js` file, to render our first `div` element. Therefore we rely on `createElement` defined in `reakt`:
    ```javascript
    import { createElement } from './reakt.js'
    import { render } from './reakt-dom.js'
    
    const App = createElement('div')
    
    render(App, document.getElementById('root'))
    ``` 
  
- Open the website in the browser to test, if the div is rendered to the DOM. You should see something like this:
    ```html
      <body>
          <div id="root">
              <div></div>
          </div>
      </body>
    ```

### 3. Adding props

- First, let's add props to our `ReactElement`. Therefore, we need to adapt the `createElement` function in `reakt.js`:
    ```javascript
   export function createElement(type, props) {
       const reaktElement = {
           type,
           props,
       }
       return reaktElement
   }
    ```
- The next step ist to add the props to our DOM element. If the DOM element contains a property with the same name, we can directly assign it to this property. 
    Otherwise, we have to set it as an attribute. 
    
    ```javascript
    function renderElement(reaktElement) {
        const { type, props } = reaktElement
    
        if (typeof type === 'string') {
            const domElement = document.createElement(type)
    
            for( let prop in props) {
                // it's a dom element property
                if (prop in domElement) {
                    domElement[prop] = props[prop]
                } else {
                    domElement.setAttribute(prop, props[prop])
                }
            }
    
            return domElement
        }
    }
    ```
    
    Attributes are part of the markdown and enable you to initialize properties, all the other props are properties because you can’t initialize (e.g. innerHTML).
    
- Adapt the App by adding for example an id to our div: 

    `const App = createElement('div', { id: 'wrapper' })`

- Check, if you can see the id in the DOM when opening the application in your browser.


### 4. Adding children

Just like before with the properties, we have to add children to our ReaktElements. To be able to have multiple children, we use the spread operator (`...children`) to create an array of children:

```javascript
export function createElement(type, props, ...children) {
    const reaktElement = {
        type,
        props,
        children,
    }
    return reaktElement
}
```
  
In `renderElement` we can loop over the childrens array. If a child is just a string, we can append a text node to the corresponding DOM element. 
Otherwise, `renderElement` is called recursively:
    
```javascript
function renderElement(reaktElement) {
    const { type, props, children } = reaktElement

    if (typeof type === 'string') {
        const domElement = document.createElement(type)

        children.forEach( child => {
            if (typeof child === 'string') {
                domElement.appendChild(document.createTextNode(child))
            } else {
                domElement.appendChild(renderElement(child))
            }
        })
        
        for( let prop in props) {
            // same as before...
            // it's a dom element property
            if (prop in domElement) {
                domElement[prop] = props[prop]
            } else {
                domElement.setAttribute(prop, props[prop])
            }
        }

        return domElement
    }
}
```

Test if everything works as expected by adding a `h1` and `h2` headline as children of our previously created `div`:
```javascript
const App = createElement('div', { id: 'wrapper' },
    createElement('h1', null, 'Hallo Reakt'),
    createElement('h2', null, 'I love Reakt')
)
```
  
### 5. Adding event handlers as props

As an example for event handling, we will implement `onclick` behavior. 

In Reakt, event handlers are marked by using camel case names of HTML event attributes, e.g. `onClick`.
We can use this convention to our advantage and add event listeners to our DOM elements:

```javascript
function renderElement(reaktElement) {
    const { type, props, children } = reaktElement

    if (typeof type === 'string') {

        // ...

        for( let prop in props) {
            // it's a dom element property
            if (prop in domElement) {
                domElement[prop] = props[prop]
            } else if (/^on/.test(prop)) { // events
                // convert onClick to 'click' for example
                const eventName = prop.substring(2).toLowerCase()
                domElement.addEventListener(eventName, props[prop])
            } else {
                domElement.setAttribute(prop, props[prop])
            }
        }

        return domElement
    }
}
```

We can check if the click handling works as expected by adding an alert to the onClick property in our wrapper div.

```javascript
const App = createElement('div', { onClick: () => alert('Clicked') },
    createElement('h1', null, 'Hallo Reakt'),
    createElement('h2', null, 'I love Reakt')
)
```

### 6. Adding support for functional components

In the following, we will create a functional component which is used as a header for our webpage.
Therefore, we create a `components` folder and put a file called `Header.js` into it.   
Our Header component accepts a `text` prop and returns a `h1` headline with this text within a wrapper `div`.
For this purpose, we can also use the `createElement` function provided by `reakt.js`

```javascript
import { createElement } from '../reakt.js'

// a functional component
function Header ({ text }) {
    return createElement('div', null,
        createElement('h1', { id: 'title' }, text),
    )
}

export default Header
```

In order to be able to render our functional component, we have to do another little change in our `renderElement` function of `reakt-dom.js`.
We have to execute the function and pass the corresponding props. Afterwards we can pass the result to the `renderElement` function again:

```javascript
function renderElement(reaktElement) {
    const { type, props, children } = reaktElement

    // support of function components
    if (typeof type === 'function') {
        return renderElement(type(props))
    }
    
    if (typeof type === 'string') {
        // ...
    }
}
```

Now we can use this component in our app.

```javascript
import Header from './components/Header.js'
 
// ...
 
const App = createElement('div', { onClick: () => alert('Clicked') },
    createElement(Header, { text: 'Hello Reakt Header' }, null),
)
```

In the browser you should see your headline with the text passed as property.


### 7. Implementing stateful logic by creating useState hook

In this section we will implement the `useState` hook to add stateful logic to our functional components.
As an example, we create a `button` to increment a counter within our `Header` component.
Moreover we use a `h2` element to show the current count value.

```javascript
// ...
import { useState } from '../reakt-dom.js'

function Header ({ text }) {
    const [count, setCount] = useState(0)

    return createElement('div', null,
        createElement('h1', { id: 'title' }, text),
        createElement('h2', null, `Count: ${count}`),
        createElement('button', { onClick: () => setCount(count + 1) }, 'Increment Count!')
    )
}
```

Hooks are part of ReactDOM and React Native. They are not implemented in React itself, React is just used as a proxy.
It needs to be part of ReactDOM / React Native due to the fact that state changes are triggering a rerender. 
The render logic is implemented in ReactDOM and React Native.

In order to implement state that is persisted throughout multiple renders, we need to have kind of a global state.
This can be done by using a global variable. Each time setState is called, a rerender is triggered.

```javascript
let hookValue

export function useState(initialValue) {
    let state = hookValue || initialValue 
    
    function setState(newValue) {
        hookValue = newValue
        render()
    }

    return [ state, setState ]
}
```

The problem of this implementation is that we can only assign the value of one `useState` hook instance.
To be able to use multiple hook instances, we could use an array and use the index of the corresponding instance as a key.

```javascript
let hooks = []
let idx = 0

export function useState(initialValue) {
    let state = hooks[idx] || initialValue
    // need to be cached because idx is global and may change
    let _idx = idx

    function setState(newValue) {
        hooks[_idx] = newValue
        render()
    }

    idx++
    return [ state, setState ]
}
```

In addition we have to adapt our render function to keep a reference to our initial reaktElement and domElement when triggering the rerender.

```javascript
let _reaktElement = null
let _domElement = null

export function render(reaktElement = _reaktElement, domElement = _domElement) {
    const app = renderElement(reaktElement)

    _reaktElement = reaktElement
    _domElement = domElement

    domElement.appendChild(app)
}
```

When executing this code, you will notice that with every click on our increment button, a new Header is added.
To fix this, we have to check if the render is the initial render or not. 
If it's not the initial render, we have to replace the old app by the current app.

```javascript
let _currentApp = null
let _reaktElement = null
let _domElement = null

export function render(reaktElement = _reaktElement, domElement = _domElement) {
    const app = renderElement(reaktElement)

    _reaktElement = reaktElement
    _domElement = domElement

    _currentApp
        ? domElement.replaceChild(app, _currentApp)
        : domElement.appendChild(app)

    _currentApp = app
}
```

This fixes the problem of multiple Header in our DOM. But when clicking our button the counter always remains at 0.
This is because our hook index `idx` is always incremented.
Each time a rerender is triggered, we have to reset `idx`. 
By doing this, useState's state is initialized with the result of the previous render cycle.

```javascript
let idx = 0

// ...

export function render(reaktElement = _reaktElement, domElement = _domElement) {
    // ...

    idx = 0
}
```

To sum up, we can say that `useState` hook can be seen as a standard JavaScript function which keeps as global state.
Every time it is used in a render method it is executed.
At first execution it is initialized by the provided value.
When `setState` is called, the global state gets updated but the resulting state for that render cycle does not change.
The value is assigned in the next render run which is automatically triggered by `setState`.
It is of special importance to keep in mind that `setState` is asynchronous!

### 8. Implementing useEffect hook

The useEffect hook accepts a callback function as well as a dependencies array. Let's call them  `callbackFn` and `deps`.
When a dependency changes, the callback function gets called.

```javascript
export function useEffect(callbackFn, deps) {
    // ...
    if (depsHaveChanged) {
        callbackFn()
    }
}
```

In order to compare the dependency array with the previous one, we store the array in our hooks array.
If there are previous dependencies, we use `Array.some` to check if at least one of them has changed.
We initialize depsHaveChanged with true due to the fact that `prevProps` are not set at initial execution, but callback function should be called anyway.

```javascript
export function useEffect(callbackFn, deps) {
    const prevDeps = hooks[idx]
    let depsHaveChanged = true

    if (prevDeps) {
        depsHaveChanged = deps.some( (dep, idx) => !Object.is(dep, prevDeps[idx]))
    }

    if (depsHaveChanged) {
        callbackFn()
    }

    hooks[idx] = deps
}
```

In our application we can validate `useEffect`s behavior for example by using a `console.log` statement.
Moreover we add another button which calls `setCount` but does not change the value.

```javascript
import { createElement } from '../reakt.js'
import { useState, useEffect } from '../reakt-dom.js'

// a functional component
function Header ({ text }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        console.log('count has changed')
    }, [count])

    return createElement('div', null,
        createElement('h1', { id: 'title' }, text),
        createElement('h2', null, `Count: ${count}`),
        createElement('button', { onClick: () => setCount(count + 1) }, 'Increment Count!'),
        createElement('button', { onClick: () => setCount(count) }, 'Not increment Count!')
    )
}

export default Header
```

Everything should work as expected. 
When 'Increment Count!' button is pressed, the callback function is executed and the log message occurs in the console of the browser.
When clicking the other button, the callback function is not executed because count did not change.

In summary we can say that like `useState`, `useEffect` can also be considered a standard JavaScript function.
It gets executed on every render method call and compares the provided dependencies by using a global state.
The callback function is just executed if at least one dependency has changed.
