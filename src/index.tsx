import App from './App'

import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'

import './index.scss'
import './tailwindElement/tailwind.css'


import { Provider } from 'react-redux'
import { store } from 'app/store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
)

reportWebVitals()
