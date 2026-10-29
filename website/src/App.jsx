import { Component, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import './App.css'

const ComingSoon = lazy(() => import('./pages/ComingSoon'))

class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Failed to load a website route.', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="route-error" role="alert" style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
        <p>Não foi possível carregar a página. / Failed to load page.</p>
        <button
          type="button"
          onClick={this.handleReload}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            background: '#fff',
            color: '#000',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Recarregar / Reload
        </button>
      </div>
    )
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <RouteErrorBoundary>
          <Suspense fallback={<div className="route-loading" role="status" aria-label="A carregar / Loading" />}>
            <Routes>
              <Route path="/" element={<ComingSoon />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </BrowserRouter>
    </LanguageProvider>
  )
}
