import type { request } from "./types";

async function handleRequests(reqs: Array<request>) {
  await Promise.all(reqs.map(handleRequest));
}

// don't touch below this line

async function handleRequest(req: request) {
  console.log(`Handling request for ${req.path}`);
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(`Done with request for ${req.path}`);
      resolve();
    }, 2000);
  });
}

async function timeLimit() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("5 seconds passed, killing server");
      resolve();
    }, 5000);
  });
}

async function main() {
  const requests: request[] = [];

  for (let i = 0; i < 4; i++) {
    requests.push({ path: `/path/${i}` });
  }

  await Promise.race([handleRequests(requests), timeLimit()]);
}

await main();
