
import React, { useState } from 'react';
import Layout from './components/Layout';
import ModulePonto from './components/ModulePonto';
import ModuleFerias from './components/ModuleFerias';
import Module13 from './components/Module13';
import ModuleGestor from './components/ModuleGestor';
import ModuleResultados from './components/ModuleResultados';
import Dashboard from './components/Dashboard';
import Documentation from './components/Documentation';
import { PontoRecord, User } from './types';
import { MOCK_USERS } from './constants';
import { useConfig } from './hooks/useConfig';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [isGestorAuthenticated, setIsGestorAuthenticated] = useState(
    sessionStorage.getItem('isGestor') === 'true'
  );
  const [pontoRecords, setPontoRecords] = useState<PontoRecord[]>([]);

  const { config, updateConfig } = useConfig();
  const GESTOR_PASSWORD = 'Eli.229*';

  const handleTabChange = (tab: string) => {
    if (tab === 'gestor' || tab === 'docs') {
      if (!isGestorAuthenticated) {
        const pass = prompt("Digite a senha de gestão para acessar:");
        if (pass === GESTOR_PASSWORD) {
          setIsGestorAuthenticated(true);
          sessionStorage.setItem('isGestor', 'true');
          setCurrentUser(MOCK_USERS[1]); // Muda para perfil Gestor se autenticado
          setActiveTab(tab);
        } else {
          alert("Senha incorreta!");
        }
      } else {
        setActiveTab(tab);
      }
    } else {
      setActiveTab(tab);
    }
  };

  const handleAddPonto = (record: PontoRecord) => {
    setPontoRecords([record, ...pontoRecords]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={currentUser} setTab={handleTabChange} />;
      case 'ponto': 
        return <ModulePonto 
          user={currentUser} 
          records={pontoRecords} 
          config={config} 
          onAdd={handleAddPonto} 
          allUsers={MOCK_USERS}
        />;
      case 'ferias': return <ModuleFerias user={currentUser} requests={[]} onAdd={() => {}} />;
      case 'resultados': return <ModuleResultados user={currentUser} users={MOCK_USERS} />;
      case '13o': return <Module13 user={currentUser} />;
      case 'gestor':
        return <ModuleGestor 
          currentUser={currentUser}
          users={MOCK_USERS} 
          appConfig={config}
          onUpdateConfig={updateConfig}
        />;
      case 'docs': return <Documentation />;
      default: return <Dashboard user={currentUser} setTab={handleTabChange} />;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      activeTab={activeTab} 
      setActiveTab={handleTabChange} 
      onLogout={() => {
        setIsGestorAuthenticated(false);
        sessionStorage.removeItem('isGestor');
        setCurrentUser(MOCK_USERS[0]);
        setActiveTab('dashboard');
      }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
