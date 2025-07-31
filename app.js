const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Welcome page
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Node Stress App</h1>
    <ul>
      <li><a href="/stress">Stress CPU</a></li>
      <li><a href="/memory">Stress Memory</a></li>
      <li><a href="/healtz">Health Check</a></li>
    </ul>
  `);
});

// Health check
app.get('/healtz', (req, res) => {
  res.status(200).send('OK');
});

// CPU stress form
app.get('/stress', (req, res) => {
  res.send(`
    <h2>Stress CPU</h2>
    <form method="POST" action="/stress">
      Duration (seconds): <input type="number" name="seconds" value="120" />
      <button type="submit">Start</button>
    </form>
    <a href="/">Back</a>
  `);
});

// CPU stress handler
app.post('/stress', (req, res) => {
  const duration = parseInt(req.body.seconds || '120', 10);
  res.send(`Starting CPU stress for ${duration} seconds after 15s delay`);

  // Delay 15 detik agar lulus health check
  setTimeout(() => {
    const end = Date.now() + duration * 1000;

    console.log(`🔥 Starting CPU stress for ${duration}s...`);

    function burnCPU() {
      if (Date.now() < end) {
        for (let i = 0; i < 1e5; i++) {
          Math.sqrt(Math.random());
        }
        setImmediate(burnCPU);
      } else {
        console.log('✅ CPU stress completed');
      }
    }

    burnCPU();
  }, 15000);
});

// Memory stress form
app.get('/memory', (req, res) => {
  res.send(`
    <h2>Stress Memory</h2>
    <form method="POST" action="/memory">
      Size (MB): <input type="number" name="mb" value="100" />
      Duration (seconds): <input type="number" name="seconds" value="30" />
      <button type="submit">Start</button>
    </form>
    <a href="/">Back</a>
  `);
});

// Memory stress handler
app.post('/memory', (req, res) => {
  const mb = parseInt(req.body.mb || '100', 10);
  const duration = parseInt(req.body.seconds || '30', 10);
  const blocks = [];

  res.send(`Stressing memory with ${mb}MB for ${duration} seconds`);

  const size = mb * 1024 * 1024;
  console.log(`🔥 Allocating ${mb}MB memory...`);

  for (let i = 0; i < size; i += 1024) {
    blocks.push(Buffer.alloc(1024)); // 1KB
  }

  setTimeout(() => {
    blocks.length = 0;
    console.log('✅ Memory stress completed');
  }, duration * 1000);
});

// CPU usage logging every 10s
setInterval(() => {
  const usage = process.cpuUsage();
  console.log(`📊 CPU Usage: user ${usage.user}μs, system ${usage.system}μs`);
}, 10000);

app.listen(port, () => {
  console.log(`🚀 App listening on http://localhost:${port}`);
});
