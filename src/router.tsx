import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import LandingPage from '@/pages/LandingPage';

// Pages
import Dashboard from '@/pages/Dashboard';
import ClientList from '@/pages/clients/ClientList';
import ClientNew from '@/pages/clients/ClientNew';
import ClientDetail from '@/pages/clients/ClientDetail';
import ClientReturns from '@/pages/clients/ClientReturns';
import ClientPlanning from '@/pages/clients/ClientPlanning';
import ClientDocuments from '@/pages/clients/ClientDocuments';
import ReturnList from '@/pages/returns/ReturnList';
import ReturnNew from '@/pages/returns/ReturnNew';
import ReturnDetail from '@/pages/returns/ReturnDetail';
import ReturnWorkpapers from '@/pages/returns/ReturnWorkpapers';
import ReturnAnalysis from '@/pages/returns/ReturnAnalysis';
import ReturnEstimates from '@/pages/returns/ReturnEstimates';
import ResearchLibrary from '@/pages/research/ResearchLibrary';
import ResearchNew from '@/pages/research/ResearchNew';
import ResearchDetail from '@/pages/research/ResearchDetail';
import IRCBrowser from '@/pages/research/IRCBrowser';
import EntityComparison from '@/pages/planning/EntityComparison';
import DepreciationCalc from '@/pages/planning/DepreciationCalc';
import IndividualPlanner from '@/pages/planning/IndividualPlanner';
import RetirementPlanner from '@/pages/planning/RetirementPlanner';
import CapitalGainsCalc from '@/pages/planning/CapitalGainsCalc';
import QBICalc from '@/pages/planning/QBICalc';
import HomeOfficeCalc from '@/pages/planning/HomeOfficeCalc';
import YearEndPlanner from '@/pages/planning/YearEndPlanner';
import SALTDashboard from '@/pages/salt/SALTDashboard';
import SALTNexus from '@/pages/salt/SALTNexus';
import SALTApportionment from '@/pages/salt/SALTApportionment';
import SALTConformity from '@/pages/salt/SALTConformity';
import EstateDashboard from '@/pages/estate/EstateDashboard';
import EstateGiftTracker from '@/pages/estate/EstateGiftTracker';
import EstateExemption from '@/pages/estate/EstateExemption';
import EstateStrategies from '@/pages/estate/EstateStrategies';
import InternationalDashboard from '@/pages/international/InternationalDashboard';
import InternationalGILTI from '@/pages/international/InternationalGILTI';
import InternationalFBAR from '@/pages/international/InternationalFBAR';
import ControversyList from '@/pages/controversy/ControversyList';
import ControversyDetail from '@/pages/controversy/ControversyDetail';
import ControversyNew from '@/pages/controversy/ControversyNew';
import FirmAnalytics from '@/pages/analytics/FirmAnalytics';
import DeadlineCalendar from '@/pages/analytics/DeadlineCalendar';
import AgentsPage from '@/pages/agents/AgentsPage';
import AgentDetail from '@/pages/agents/AgentDetail';
import SettingsPage from '@/pages/SettingsPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppLayout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Clients */}
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientNew />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/clients/:id/returns" element={<ClientReturns />} />
        <Route path="/clients/:id/planning" element={<ClientPlanning />} />
        <Route path="/clients/:id/documents" element={<ClientDocuments />} />

        {/* Tax Returns */}
        <Route path="/returns" element={<ReturnList />} />
        <Route path="/returns/new" element={<ReturnNew />} />
        <Route path="/returns/:id" element={<ReturnDetail />} />
        <Route path="/returns/:id/workpapers" element={<ReturnWorkpapers />} />
        <Route path="/returns/:id/analysis" element={<ReturnAnalysis />} />
        <Route path="/returns/:id/estimates" element={<ReturnEstimates />} />

        {/* Research */}
        <Route path="/research" element={<ResearchLibrary />} />
        <Route path="/research/new" element={<ResearchNew />} />
        <Route path="/research/:id" element={<ResearchDetail />} />
        <Route path="/research/irc" element={<IRCBrowser />} />

        {/* Planning Tools */}
        <Route path="/planning/entity-comparison" element={<EntityComparison />} />
        <Route path="/planning/depreciation" element={<DepreciationCalc />} />
        <Route path="/planning/individual" element={<IndividualPlanner />} />
        <Route path="/planning/retirement" element={<RetirementPlanner />} />
        <Route path="/planning/capital-gains" element={<CapitalGainsCalc />} />
        <Route path="/planning/qbi" element={<QBICalc />} />
        <Route path="/planning/home-office" element={<HomeOfficeCalc />} />
        <Route path="/planning/year-end" element={<YearEndPlanner />} />

        {/* SALT */}
        <Route path="/salt" element={<SALTDashboard />} />
        <Route path="/salt/nexus" element={<SALTNexus />} />
        <Route path="/salt/apportionment" element={<SALTApportionment />} />
        <Route path="/salt/conformity" element={<SALTConformity />} />

        {/* Estate */}
        <Route path="/estate" element={<EstateDashboard />} />
        <Route path="/estate/gift-tracker" element={<EstateGiftTracker />} />
        <Route path="/estate/exemption" element={<EstateExemption />} />
        <Route path="/estate/strategies" element={<EstateStrategies />} />

        {/* International */}
        <Route path="/international" element={<InternationalDashboard />} />
        <Route path="/international/gilti" element={<InternationalGILTI />} />
        <Route path="/international/fbar" element={<InternationalFBAR />} />

        {/* Controversy */}
        <Route path="/controversy" element={<ControversyList />} />
        <Route path="/controversy/new" element={<ControversyNew />} />
        <Route path="/controversy/:id" element={<ControversyDetail />} />

        {/* Analytics */}
        <Route path="/analytics" element={<FirmAnalytics />} />
        <Route path="/analytics/deadlines" element={<DeadlineCalendar />} />

        {/* AI Agents */}
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/agents/:id" element={<AgentDetail />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/:tab" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
