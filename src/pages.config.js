import Dashboard from './pages/Dashboard';
import ScoringTool from './pages/ScoringTool';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "ScoringTool": ScoringTool,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};