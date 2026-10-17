import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir:'./tests/browser',
  timeout:30000,
  expect:{timeout:10000},
  fullyParallel:true,
  retries:process.env.CI?1:0,
  workers:process.env.CI?2:undefined,
  reporter:process.env.CI?'github':'list',
  use:{baseURL:'http://127.0.0.1:4173',viewport:{width:1280,height:900},trace:'retain-on-failure',screenshot:'only-on-failure'},
  webServer:{command:'npm run preview -- --port 4173 --strictPort',url:'http://127.0.0.1:4173/FutureArchive/',reuseExistingServer:!process.env.CI,timeout:30000},
});
