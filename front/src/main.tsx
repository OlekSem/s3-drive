
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ThemeProvider} from "./providers/ThemeProvider.tsx";
import {Provider} from "react-redux";
import {setupStore} from "./store";

const store = setupStore();
createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
      <Provider store={store}>
          <App />
      </Provider>
  </ThemeProvider>,
)
