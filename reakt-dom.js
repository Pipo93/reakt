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

function renderElement(reaktElement) {
    const { type, props, children } = reaktElement

    // support of function components
    if (typeof type === 'function') {
        return renderElement(type(props))
    }

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
    idx = 0
}
