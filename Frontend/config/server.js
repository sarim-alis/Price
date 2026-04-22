// Server configuration
const SERVER_IP = '10.62.37.173';
const SERVER_PORT = 5000;
const FLASK_PORT = 5001;
const FRONTEND_PORT = 8081;

export const serverConfig = {
  SERVER_IP,
  SERVER_PORT,
  FLASK_PORT,
  FRONTEND_PORT,
  API_URL: `http://${SERVER_IP}:${SERVER_PORT}/api`,
  SERVER_URL: `http://${SERVER_IP}:${SERVER_PORT}`,
  SOCKET_URL: `http://${SERVER_IP}:${SERVER_PORT}`,
  FLASK_URL: `http://${SERVER_IP}:${FLASK_PORT}`,
};

export default serverConfig;
