import Dashboard from './pages/Dashboard';
import ScoringTool from './pages/ScoringTool';
import Records from './pages/Records';
import ProjectView from './pages/ProjectView';
import ProjectGraphs from './pages/ProjectGraphs';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "ScoringTool": ScoringTool,
    "Records": Records,
    "ProjectView": ProjectView,
    "ProjectGraphs": ProjectGraphs,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};