// Server configuration
const SERVER_IP = '10.62.37.173';
const SERVER_PORT = 5000;
const FLASK_PORT = 5001;

export const serverConfig = {
  SERVER_IP,
  SERVER_PORT,
  FLASK_PORT,
  SERVER_URL: `http://${SERVER_IP}:${SERVER_PORT}`,
  FLASK_URL: `http://${SERVER_IP}:${FLASK_PORT}`,
  FRONTEND_URL: `http://${SERVER_IP}:8081`,
};

export default serverConfig;
