import { handleRequest } from "./bot";

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleRequest(event));
  } catch (err) {
    console.error(err.stack);
    return event.respondWith(
      new Response(JSON.stringify({ ok: false }), { status: 500 })
    );
  }
});
