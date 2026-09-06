// offlineQueue.js - Manages offline queue storage & automatic background sync
const QUEUE_KEY = 'kc_offline_queue_v1';

export const getOfflineQueue = () => {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const enqueueAction = (actionType, payload) => {
  const queue = getOfflineQueue();
  const item = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    actionType,
    payload,
    timestamp: new Date().toISOString()
  };
  queue.push(item);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return item;
};

export const clearQueue = () => {
  localStorage.removeItem(QUEUE_KEY);
};

export const syncOfflineQueue = async (apiCallHandler) => {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0 };

  let synced = 0;
  for (const item of queue) {
    try {
      if (apiCallHandler) {
        await apiCallHandler(item);
      }
      synced++;
    } catch (err) {
      console.error('Failed to sync item:', item, err);
    }
  }

  clearQueue();
  return { syncedCount: synced };
};
