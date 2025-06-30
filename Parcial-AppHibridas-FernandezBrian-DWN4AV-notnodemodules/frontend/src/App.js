import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAutenticacion } from './contexto/ContextoAutenticacion';
import { ProveedorNotificaciones } from './contexto/ContextoNotificaciones';
import RutaProtegida from './componentes/RutaProtegida/RutaProtegida';
import RutaPublica from './componentes/RutaProtegida/RutaPublica';
import Header from './componentes/Header/Header';
import Footer from './componentes/Footer/Footer';
import Loading from './componentes/Loading/Loading';
import ErrorBoundary from './componentes/Error/ErrorBoundary';
import ContenedorNotificaciones from './componentes/Notificaciones/Notificaciones';
import './estilos/App.scss';

const Inicio = lazy(() => import('./paginas/Inicio/Inicio'));
const IniciarSesion = lazy(() => import('./paginas/IniciarSesion/IniciarSesion'));
const Registro = lazy(() => import('./paginas/Registro/Registro'));
const Jugadores = lazy(() => import('./paginas/Jugadores/Jugadores'));
const Entrenamientos = lazy(() => import('./paginas/Entrenamientos/Entrenamientos'));

const PaginaNoEncontrada = () => (
  <div className="contenedor fade-in" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
    <h1 style={{ fontSize: '4rem', color: '#06b6d4', marginBottom: '1rem' }}>404</h1>
    <h2 style={{ marginBottom: '1rem' }}>Página no encontrada</h2>
    <p style={{ marginBottom: '2rem', color: '#64748b' }}>
      La página que buscas no existe o ha sido movida.
    </p>
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      <a href="/" className="btn btn-primario">Ir al Inicio</a>
      <a href="/jugadores" className="btn btn-secundario">Ver Jugadores</a>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ProveedorNotificaciones>
        <ProveedorAutenticacion>
          <Router>
            <div className="App">
              <Header />
              <main className="contenido-principal">
                <Routes>
                  {/* Ruta de inicio - siempre accesible */}
                  <Route 
                    path="/" 
                    element={
                      <Suspense fallback={<Loading />}>
                        <Inicio />
                      </Suspense>
                    } 
                  />
                  
                  <Route 
                    path="/iniciar-sesion" 
                    element={
                      <RutaPublica>
                        <Suspense fallback={<Loading />}>
                          <IniciarSesion />
                        </Suspense>
                      </RutaPublica>
                    } 
                  />
                  <Route 
                    path="/registro" 
                    element={
                      <RutaPublica>
                        <Suspense fallback={<Loading />}>
                          <Registro />
                        </Suspense>
                      </RutaPublica>
                    } 
                  />
                  
                  <Route 
                    path="/jugadores" 
                    element={
                      <RutaProtegida>
                        <Suspense fallback={<Loading />}>
                          <Jugadores />
                        </Suspense>
                      </RutaProtegida>
                    } 
                  />
                  <Route 
                    path="/entrenamientos" 
                    element={
                      <RutaProtegida>
                        <Suspense fallback={<Loading />}>
                          <Entrenamientos />
                        </Suspense>
                      </RutaProtegida>
                    } 
                  />
                  
                  <Route path="/login" element={<Navigate to="/iniciar-sesion" replace />} />
                  <Route path="/register" element={<Navigate to="/registro" replace />} />
                  
                  <Route path="*" element={<PaginaNoEncontrada />} />
                </Routes>
              </main>
              <Footer />
              <ContenedorNotificaciones />
            </div>
          </Router>
        </ProveedorAutenticacion>
      </ProveedorNotificaciones>
    </ErrorBoundary>
  );
}

export default App; 