import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { router } from './App.jsx'
import { Provider } from 'react-redux'
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './Redux/Store.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
})
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
      <RouterProvider router={router}/>
      
        {/* <BrowserRouter> */}
          <App />
        {/* </BrowserRouter> */}
      </Provider>
    </QueryClientProvider>
  // </StrictMode>,
)
