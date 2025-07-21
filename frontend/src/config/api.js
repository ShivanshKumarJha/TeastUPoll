const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_URL || 'https://teastupoll.azurewebsites.net',
  SOCKET_URL:
    import.meta.env.VITE_SOCKET_URL || 'https://teastupoll.webpubsub.azure.com',

  // API endpoints
  ENDPOINTS: {
    POLLS: '/api/polls',
    ACTIVE_POLL: '/api/active-poll',
    ACTIVE_STUDENTS: '/api/active-students',
  },

  // Socket configuration - different for local vs Azure Web PubSub
  getSocketConfig: () => {
    const isLocal = API_CONFIG.SOCKET_URL.includes('localhost');
    const isAzureWebPubSub = API_CONFIG.SOCKET_URL.includes(
      'webpubsub.azure.com'
    );

    if (isLocal) {
      // Local development - connect to local backend
      return {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        autoConnect: true,
      };
    } else if (isAzureWebPubSub) {
      // Azure Web PubSub configuration
      return {
        path: '/clients/socketio/hubs/pollHub',
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        autoConnect: true,
      };
    } else {
      // Regular Socket.IO server configuration
      return {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        autoConnect: true,
      };
    }
  },
};

export default API_CONFIG;
