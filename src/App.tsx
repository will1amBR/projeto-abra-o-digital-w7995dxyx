import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

// Institutional Pages (Ambiente 1)
import Home from '@/pages/Home'
import NossaHistoria from '@/pages/NossaHistoria'
import Voluntariado from '@/pages/Voluntariado'
import AreaDoVoluntario from '@/pages/AreaDoVoluntario'
import Noticias from '@/pages/Noticias'
import NoticiaDetalhe from '@/pages/NoticiaDetalhe'
import Beneficiados from '@/pages/Beneficiados'
import BeneficiadoDetalhe from '@/pages/BeneficiadoDetalhe'
import Patrocinadores from '@/pages/Patrocinadores'
import PatrocinadorDetalhe from '@/pages/PatrocinadorDetalhe'

// Abraçolândia Hotsite (Ambiente 2)
import AbracolandiaHome from '@/pages/abracolandia/AbracolandiaHome'
import AFesta from '@/pages/abracolandia/AFesta'
import Convites from '@/pages/abracolandia/Convites'
import IngressosOnline from '@/pages/abracolandia/IngressosOnline'
import AbraBeneficiados from '@/pages/abracolandia/AbraBeneficiados'
import AbraPatrocinadores from '@/pages/abracolandia/AbraPatrocinadores'
import AbraVoluntariado from '@/pages/abracolandia/AbraVoluntariado'
import FestasAnteriores from '@/pages/abracolandia/FestasAnteriores'

// Bingo Público
import AbracolandiaBingoPublic from '@/pages/abracolandia/AbracolandiaBingoPublic'

// CMS Admin (Painel Protegido)
import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import ValidarIngressos from '@/pages/admin/ValidarIngressos'
import AdminCaixa from '@/pages/admin/AdminCaixa'
import AdminBingo from '@/pages/admin/AdminBingo'
import NotFound from '@/pages/NotFound'

// Protected Admin Route Guard
const ProtectedAdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-sm">
        Carregando painel administrativo...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* =========================================
              AMBIENTE 1: WEBSITE INSTITUCIONAL (PROJETO ABRAÇO)
              ========================================= */}
          <Route path="/" element={<Home />} />
          <Route path="/nossa-historia" element={<NossaHistoria />} />
          <Route path="/voluntariado" element={<Voluntariado />} />
          <Route path="/area-do-voluntario" element={<AreaDoVoluntario />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:slug" element={<NoticiaDetalhe />} />
          <Route path="/beneficiados" element={<Beneficiados />} />
          <Route path="/beneficiados/:slug" element={<BeneficiadoDetalhe />} />
          <Route path="/patrocinadores" element={<Patrocinadores />} />
          <Route path="/patrocinadores/:slug" element={<PatrocinadorDetalhe />} />

          {/* =========================================
              AMBIENTE 2: HOTSITE ABRAÇOLÂNDIA
              ========================================= */}
          <Route path="/abracolandia" element={<AbracolandiaHome />} />
          <Route path="/abracolandia/a-festa" element={<AFesta />} />
          <Route
            path="/abracolandia/festa"
            element={<Navigate to="/abracolandia/a-festa" replace />}
          />
          <Route path="/abracolandia/convites" element={<Convites />} />
          <Route path="/abracolandia/ingressos" element={<IngressosOnline />} />
          <Route path="/abracolandia/bingo" element={<AbracolandiaBingoPublic />} />
          <Route path="/abracolandia/beneficiados" element={<AbraBeneficiados />} />
          <Route path="/abracolandia/patrocinadores" element={<AbraPatrocinadores />} />
          <Route path="/abracolandia/patrocinadores/:slug" element={<PatrocinadorDetalhe />} />
          <Route path="/abracolandia/voluntariado" element={<AbraVoluntariado />} />
          <Route path="/abracolandia/festas-anteriores" element={<FestasAnteriores />} />

          {/* =========================================
              PAINEL CMS ADMINISTRATIVO
              ========================================= */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/validar-ingressos"
            element={
              <ProtectedAdminRoute>
                <ValidarIngressos />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/caixa"
            element={
              <ProtectedAdminRoute>
                <AdminCaixa />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/bingo"
            element={
              <ProtectedAdminRoute>
                <AdminBingo />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
