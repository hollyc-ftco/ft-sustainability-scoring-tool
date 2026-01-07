import Dashboard from './pages/Dashboard';
import EditProject from './pages/EditProject';
import Home from './pages/Home';
import ProjectGraphs from './pages/ProjectGraphs';
import ProjectView from './pages/ProjectView';
import Records from './pages/Records';
import Reports from './pages/Reports';
import ScoringTool from './pages/ScoringTool';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "EditProject": EditProject,
    "Home": Home,
    "ProjectGraphs": ProjectGraphs,
    "ProjectView": ProjectView,
    "Records": Records,
    "Reports": Reports,
    "ScoringTool": ScoringTool,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};