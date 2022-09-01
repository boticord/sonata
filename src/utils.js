"use strict";

function hex2bin(hex) {
  const buf = new Uint8Array(Math.ceil(hex.length / 2));
  for (var i = 0; i < buf.length; i++) {
    buf[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return buf;
}

const PUBLIC_KEY = crypto.subtle.importKey(
  "raw",
  hex2bin(publicKey),
  {
    name: "NODE-ED25519",
    namedCurve: "NODE-ED25519",
  },
  true,
  ["verify"]
);

const encoder = new TextEncoder();

async function verify(request) {
  const signature = hex2bin(request.headers.get("X-Signature-Ed25519"));
  const timestamp = request.headers.get("X-Signature-Timestamp");
  const unknown = await request.clone().text();

  return await crypto.subtle.verify(
    "NODE-ED25519",
    await PUBLIC_KEY,
    signature,
    encoder.encode(timestamp + unknown)
  );
}

const respond = (response, status = 200) =>
  new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Content-Encoding": "identity",
    },
  });

module.exports = { verify, respond };
