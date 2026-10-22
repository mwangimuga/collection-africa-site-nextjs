// cPanel entry point — used only when deploying via cPanel's "Setup Node.js
// App" (Passenger). Every other deployment path (Vercel, a plain VPS, local
// dev) runs `next start` instead and never touches this file.
//
// Passenger runs this file directly and expects the app to listen on
// process.env.PORT, which it sets itself. Full walkthrough:
// docs/user-guide.md, "Deploying on cPanel".
import { createServer } from "node:http";
import next from "next";

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Collection Africa website listening on port ${port}`);
  });
});
