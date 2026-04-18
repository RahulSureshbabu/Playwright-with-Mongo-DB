const { BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const http = require("http");

const BASE_URL = "http://127.0.0.1:4173";

let browser;
let serverProcess;
let serverStartedBySuite = false;

setDefaultTimeout(30 * 1000);

function checkServerUp() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });

    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    // Poll until the app server starts accepting requests.
    if (await checkServerUp()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Demo app server did not start within timeout");
}

BeforeAll(async () => {
  const isRunning = await checkServerUp();
  if (!isRunning) {
    serverProcess = spawn(process.execPath, ["server.js"], {
      cwd: process.cwd(),
      stdio: "ignore"
    });

    serverStartedBySuite = true;
    await waitForServer(15000);
  }

  browser = await chromium.launch({ headless: true });
});

AfterAll(async () => {
  if (browser) {
    await browser.close();
  }

  if (serverStartedBySuite && serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
});

Before(async function () {
  this.browser = browser;
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  await this.page.goto(BASE_URL);
});

After(async function () {
  if (this.context) {
    await this.context.close();
  }
});
