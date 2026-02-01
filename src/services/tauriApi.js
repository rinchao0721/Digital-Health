import { invoke } from '@tauri-apps/api/tauri';

export const fetchDashboardData = async () => {
  try {
    const data = await invoke('get_dashboard_data');
    return data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};

export const refreshStats = async () => {
  try {
    await invoke('refresh_stats');
  } catch (error) {
    console.error('Failed to refresh stats:', error);
  }
};
