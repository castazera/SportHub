import React from 'react';
import './Error.scss';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('Error capturado:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null
    });
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4"/>
                <path d="M12 16h.01"/>
              </svg>
            </div>
            
            <h1>¡Oops! Algo salió mal</h1>
            <p className="error-message">
              La aplicación encontró un error inesperado.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Detalles del error</summary>
                <div className="error-info">
                  <pre>{this.state.error.toString()}</pre>
                </div>
              </details>
            )}

            <div className="error-actions">
              <button 
                className="btn btn-primario"
                onClick={this.handleRetry}
              >
                Intentar de nuevo
              </button>
              
              <button 
                className="btn btn-secundario"
                onClick={this.handleReload}
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 