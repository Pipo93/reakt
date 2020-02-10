import { createElement } from './reakt.js'
import { render } from './reakt-dom.js'
import Header from './components/Header.js'

const App = createElement('div', null,
    createElement(Header, { text: 'Hello Reakt Header' }, null),
)

render(App, document.getElementById('root'))
