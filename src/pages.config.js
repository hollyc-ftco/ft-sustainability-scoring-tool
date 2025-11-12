import Dashboard from './pages/Dashboard';
import ScoringTool from './pages/ScoringTool';
import Records from './pages/Records';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "ScoringTool": ScoringTool,
    "Records": Records,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};