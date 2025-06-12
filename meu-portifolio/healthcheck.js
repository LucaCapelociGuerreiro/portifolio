// ==============================================================================
// HEALTHCHECK ULTRA-OTIMIZADO - ANALISTA DEVOPS SÊNIOR
// ==============================================================================
// Health check eficiente para container Docker em Oracle Cloud
// Minimiza overhead de CPU/RAM durante verificações

const http = require('http');

// Configurações otimizadas
const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/',
  method: 'GET',
  timeout: 3000, // 3 segundos timeout
  headers: {
    'User-Agent': 'Docker-HealthCheck/1.0'
  }
};

// Função de health check otimizada
function healthCheck() {
  const req = http.request(options, (res) => {
    // Considera sucesso se status 200-399
    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log(`Health check OK: ${res.statusCode}`);
      process.exit(0);
    } else {
      console.error(`Health check FAIL: ${res.statusCode}`);
      process.exit(1);
    }
  });

  // Timeout handler
  req.on('timeout', () => {
    console.error('Health check TIMEOUT');
    req.destroy();
    process.exit(1);
  });

  // Error handler
  req.on('error', (err) => {
    console.error(`Health check ERROR: ${err.message}`);
    process.exit(1);
  });

  // Enviar request
  req.end();
}

// Executar health check
healthCheck();