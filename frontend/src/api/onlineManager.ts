import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

let configured = false;

export function configureOnlineManager() {
  if (configured) return;
  configured = true;

  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    })
  );
}
