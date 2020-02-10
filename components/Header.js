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
