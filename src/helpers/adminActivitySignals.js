import SummaryApi from '../common';

export const customerTabIds = ['orders', 'renewals', 'payments', 'invoices', 'updates', 'closure'];

const emptyModuleState = () => ({
  count: 0,
  latestActivityAt: null,
});

const toTimestamp = (value) => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const normalizeClientActivity = (client = {}) => ({
  userId: client.userId,
  latestActivityAt: client.latestActivityAt || null,
  totalCount: client.totalCount || 0,
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
    const totalCount = clients.reduce((sum, client) => sum + (client.modules[moduleKey]?.count || 0), 0);
    const latestActivityAt = clients.reduce(
      (latest, client) => Math.max(latest, toTimestamp(client.modules[moduleKey]?.latestActivityAt)),
      0
    );

    acc[moduleKey] = {
      count: totalCount,
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

export const markWorkspaceActivitySeen = async ({ targetUserId, moduleKey, seenAt }) => {
  const response = await fetch(SummaryApi.markWorkspaceActivitySeen.url, {
    method: SummaryApi.markWorkspaceActivitySeen.method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetUserId,
      moduleKey,
      seenAt,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to mark workspace activity as seen');
  }

  return result.data;
};

export const getClientTotalCount = (clientActivity) => clientActivity?.totalCount || 0;

export const getClientLatestActivity = (clientActivity) => toTimestamp(clientActivity?.latestActivityAt);

export const getModuleCount = (clientActivity, moduleKey) => clientActivity?.modules?.[moduleKey]?.count || 0;

export const hasClientUnreadActivity = (clientActivity) => getClientTotalCount(clientActivity) > 0;

export const hasModuleUnreadActivity = (clientActivity, moduleKey) => getModuleCount(clientActivity, moduleKey) > 0;

export const getDashboardModuleCount = (activitySummary, moduleKey) => activitySummary?.moduleTotals?.[moduleKey]?.count || 0;

export const hasDashboardModuleActivity = (activitySummary, moduleKey) => getDashboardModuleCount(activitySummary, moduleKey) > 0;

export const getDashboardModuleLatestActivity = (activitySummary, moduleKey) =>
  toTimestamp(activitySummary?.moduleTotals?.[moduleKey]?.latestActivityAt);
