import { renderHeader } from './components/header.js';
import { renderSidebar, highlightActiveLink } from './components/sidebar.js';
import { initRouter } from './router.js';
import DashboardPage from './pages/dashboard.js';
import MembersListPage from './pages/members/list.js';
import MemberDetailPage from './pages/members/detail.js';
import InboxPage from './pages/automation/inbox.js';
import SentPage from './pages/automation/sent.js';
import DraftsPage from './pages/automation/drafts.js';
import UsersPage from './pages/automation/users.js';
import OrgStructurePage from './pages/automation/orgStructure.js';

const contentEl = document.getElementById('content');
const headerEl = document.getElementById('header');
const sidebarEl = document.getElementById('sidebar');

renderHeader(headerEl);
renderSidebar(sidebarEl);

const routes = [
  { path: '/', component: DashboardPage },
  { path: '/members', component: MembersListPage },
  { path: '/members/:id', component: MemberDetailPage },
  { path: '/automation/inbox', component: InboxPage },
  { path: '/automation/sent', component: SentPage },
  { path: '/automation/drafts', component: DraftsPage },
  { path: '/automation/users', component: UsersPage },
  { path: '/automation/org-structure', component: OrgStructurePage },
];

initRouter({ routes, outlet: contentEl, onRoute: highlightActiveLink });