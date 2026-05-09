import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsThisWeek: 0,
    patientsWithoutReturn: []
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Total de pacientes ativos
      const { count: patientsCount, error: patientsError } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true })
        .eq('nutricionista_id', user.id);

      if (patientsError) throw patientsError;

      // 2. Consultas da semana
      const today = new Date();
      const firstDay = new Date(today);
      firstDay.setDate(today.getDate() - today.getDay());
      firstDay.setHours(0, 0, 0, 0);
      
      const lastDay = new Date(firstDay);
      lastDay.setDate(firstDay.getDate() + 6);
      lastDay.setHours(23, 59, 59, 999);
      
      const startDate = firstDay.toISOString();
      const endDate = lastDay.toISOString();

      const { count: weeklyAppointments, error: appointmentsError } = await supabase
        .from('consultas')
        .select('id, paciente_id!inner(nutricionista_id)', { count: 'exact', head: true })
        .eq('paciente_id.nutricionista_id', user.id)
        .gte('data_consulta', startDate)
        .lte('data_consulta', endDate);

      if (appointmentsError) throw appointmentsError;

      // 3. Pacientes sem retorno (> 30 dias desde a última consulta e sem próximo retorno agendado)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];

      // Pegamos todos os pacientes
      const { data: patients, error: pError } = await supabase
        .from('pacientes')
        .select('id, nome')
        .eq('nutricionista_id', user.id);

      if (pError) throw pError;

      const patientsWithoutReturnList = [];

      for (const patient of patients) {
        // Pegamos a última consulta
        const { data: lastConsultas, error: cError } = await supabase
          .from('consultas')
          .select('data_consulta, proximo_retorno')
          .eq('paciente_id', patient.id)
          .order('data_consulta', { ascending: false })
          .limit(1);

        if (cError) throw cError;

        if (lastConsultas && lastConsultas.length > 0) {
          const last = lastConsultas[0];
          const lastDate = last.data_consulta;
          
          // Se a última foi há mais de 30 dias
          if (lastDate < thirtyDaysAgoStr) {
            // Verificamos se há algum retorno futuro agendado
            const { data: futureReturns, error: fError } = await supabase
              .from('consultas')
              .select('id')
              .eq('paciente_id', patient.id)
              .gt('data_consulta', todayStr)
              .limit(1);

            if (fError) throw fError;

            if (!futureReturns || futureReturns.length === 0) {
              // Também verificamos se o campo proximo_retorno da última consulta é no futuro
              if (!last.proximo_retorno || last.proximo_retorno <= todayStr) {
                patientsWithoutReturnList.push(patient);
              }
            }
          }
        }
      }

      setStats({
        totalPatients: patientsCount || 0,
        appointmentsThisWeek: weeklyAppointments || 0,
        patientsWithoutReturn: patientsWithoutReturnList
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="dashboard-layout">
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header className="page-header">
          <h2>Bem-vinda, Nutri!</h2>
          <p>Aqui está o resumo do seu consultório hoje.</p>
        </header>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando dados...</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* Card 1: Total de Pacientes */}
            <div className="stat-card">
              <div className="stat-icon patient-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Total de pacientes ativos</span>
                <div className="stat-value">{stats.totalPatients}</div>
              </div>
            </div>
            
            {/* Card 2: Consultas da Semana */}
            <div className="stat-card">
              <div className="stat-icon calendar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Consultas da semana</span>
                <div className="stat-value">{stats.appointmentsThisWeek}</div>
              </div>
            </div>

            {/* Card 3: Pacientes sem retorno (Lista) */}
            <div className="stat-card list-card">
              <div className="card-header">
                <div className="stat-icon alert-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <span className="stat-label">Pacientes sem retorno</span>
              </div>
              
              <div className="no-return-list">
                {stats.patientsWithoutReturn.length > 0 ? (
                  stats.patientsWithoutReturn.slice(0, 5).map(patient => (
                    <Link 
                      key={patient.id} 
                      to={`/pacientes/${patient.id}`}
                      className="no-return-item"
                    >
                      <span>{patient.nome}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </Link>
                  ))
                ) : (
                  <p className="empty-list-msg">Nenhum paciente sem retorno no momento</p>
                )}
                {stats.patientsWithoutReturn.length > 5 && (
                  <Link to="/pacientes" className="see-more">Ver todos os pacientes</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
