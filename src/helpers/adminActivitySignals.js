import SummaryApi from '../common';

export const customerTabIds = ['orders', 'renewals', 'payments', 'invoices', 'updates', 'closure'];

const emptyModuleState = () => ({
  attentionCount: 0,
  inProgressCount: 0,
  totalActiveCount: 0,
  latestActivityAt: null,
  items: [],
});

const toTimestamp = (value) => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const normalizeClientActivity = (client = {}) => ({
  userId: client.userId,
  latestActivityAt: client.latestActivityAt || null,
  attentionCount: client.attentionCount || 0,
  inProgressCount: client.inProgressCount || 0,
  totalActiveCount: client.totalActiveCount || 0,
  modules: {
    orders: client.modules?.orders || emptyModuleState(),
    renewals: client.modules?.renewals || emptyModuleState(),
    payments: client.modules?.payments || emptyModuleState(),
    invoices: client.modules?.invoices || emptyModuleState(),
    updates: client.modules?.updates || emptyModuleState(),
    closure: client.modules?.closure || emptyModuleState(),
  },
});

export const fetchWorkspaceActivityCounts = async () => {
  const response = await fetch(SummaryApi.workspaceActivityCounts.url, {
    method: SummaryApi.workspaceActivityCounts.method,
    credentials: 'include',
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to load workspace activity counts');
  }

  const clients = (result.data?.clients || []).map(normalizeClientActivity);
  const clientMap = clients.reduce((acc, client) => {
    acc[client.userId] = client;
    return acc;
  }, {});

  const moduleTotals = customerTabIds.reduce((acc, moduleKey) => {
    const attentionCount = clients.reduce((sum, client) => sum + (client.modules[moduleKey]?.attentionCount || 0), 0);
    const inProgressCount = clients.reduce((sum, client) => sum + (client.modules[moduleKey]?.inProgressCount || 0), 0);
    const latestActivityAt = clients.reduce(
      (latest, client) => Math.max(latest, toTimestamp(client.modules[moduleKey]?.latestActivityAt)),
      0
    );

    acc[moduleKey] = {
      attentionCount,
      inProgressCount,
      totalActiveCount: attentionCount + inProgressCount,
      latestActivityAt: latestActivityAt ? new Date(latestActivityAt).toISOString() : null,
    };
    return acc;
  }, {});

  return {
    clients,
    clientMap,
    moduleTotals,
  };
};

export const getClientTotalCount = (clientActivity) => clientActivity?.totalCount || 0;
export const getClientActiveCount = (clientActivity) => clientActivity?.totalActiveCount || clientActivity?.totalCount || 0;
export const getClientAttentionCount = (clientActivity) => clientActivity?.attentionCount || 0;
export const getClientInProgressCount = (clientActivity) => clientActivity?.inProgressCount || 0;

export const getClientLatestActivity = (clientActivity) => toTimestamp(clientActivity?.latestActivityAt);

export const getModuleCount = (clientActivity, moduleKey) =>
  clientActivity?.modules?.[moduleKey]?.totalActiveCount || clientActivity?.modules?.[moduleKey]?.count || 0;

export const getModuleAttentionCount = (clientActivity, moduleKey) =>
  clientActivity?.modules?.[moduleKey]?.attentionCount || 0;

export const getModuleInProgressCount = (clientActivity, moduleKey) =>
  clientActivity?.modules?.[moduleKey]?.inProgressCount || 0;

export const getModuleItems = (clientActivity, moduleKey) => clientActivity?.modules?.[moduleKey]?.items || [];

export const hasClientUnreadActivity = (clientActivity) => getClientActiveCount(clientActivity) > 0;

export const hasModuleUnreadActivity = (clientActivity, moduleKey) => getModuleCount(clientActivity, moduleKey) > 0;

export const getDashboardModuleCount = (activitySummary, moduleKey) => activitySummary?.moduleTotals?.[moduleKey]?.totalActiveCount || 0;

export const getDashboardModuleAttentionCount = (activitySummary, moduleKey) =>
  activitySummary?.moduleTotals?.[moduleKey]?.attentionCount || 0;

export const getDashboardModuleInProgressCount = (activitySummary, moduleKey) =>
  activitySummary?.moduleTotals?.[moduleKey]?.inProgressCount || 0;

export const hasDashboardModuleActivity = (activitySummary, moduleKey) => getDashboardModuleCount(activitySummary, moduleKey) > 0;

export const getDashboardModuleLatestActivity = (activitySummary, moduleKey) =>
  toTimestamp(activitySummary?.moduleTotals?.[moduleKey]?.latestActivityAt);

export const getClientBadgeState = (clientActivity) => {
  if (getClientAttentionCount(clientActivity) > 0) return 'attention';
  if (getClientInProgressCount(clientActivity) > 0) return 'inProgress';
  return 'clear';
};

export const getModuleBadgeState = (clientActivity, moduleKey) => {
  if (getModuleAttentionCount(clientActivity, moduleKey) > 0) return 'attention';
  if (getModuleInProgressCount(clientActivity, moduleKey) > 0) return 'inProgress';
  return 'clear';
};

export const getDashboardModuleBadgeState = (activitySummary, moduleKey) => {
  if (getDashboardModuleAttentionCount(activitySummary, moduleKey) > 0) return 'attention';
  if (getDashboardModuleInProgressCount(activitySummary, moduleKey) > 0) return 'inProgress';
  return 'clear';
};

export const getBadgeClasses = (state) => {
  if (state === 'attention') return 'bg-red-500 text-white';
  if (state === 'inProgress') return 'bg-yellow-400 text-yellow-950';
  return '';
};
