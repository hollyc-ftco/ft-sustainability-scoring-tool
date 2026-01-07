import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProjectGraphs from './pages/ProjectGraphs';
import ProjectView from './pages/ProjectView';
import Records from './pages/Records';
import Reports from './pages/Reports';
import ScoringTool from './pages/ScoringTool';
import EditProject from './pages/EditProject';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Home": Home,
    "ProjectGraphs": ProjectGraphs,
    "ProjectView": ProjectView,
    "Records": Records,
    "Reports": Reports,
    "ScoringTool": ScoringTool,
    "EditProject": EditProject,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};