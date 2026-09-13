import { chromium } from "playwright";
const wait = ms => new Promise(r=>setTimeout(r,ms));
const b = await chromium.launch();
const p = await b.newPage({viewport:{width:390,height:844}});
const errs=[]; p.on("pageerror",e=>errs.push("pageerror: "+e.message));
p.on("console",m=>{if(m.type()==="error")errs.push("console: "+m.text());});
p.on("requestfailed",r=>errs.push("reqfail: "+r.url().slice(0,80)));

await p.goto("https://vibeployed.com/",{waitUntil:"networkidle"});
// Confirm the new build is actually live
const built = await p.evaluate(()=>document.querySelector('script[src*="/assets/index-"]')?.src.split("/").pop());
console.log("bundle on live:", built);

await p.evaluate(()=>document.querySelector("#contact")?.scrollIntoView());
await wait(1500);
await p.fill("#name","Shivam");
await p.fill("#email","support.vibeployed@gmail.com");
await p.fill("#company","Vibeployed");
await p.fill("#message","Live check of the retain-details fix. Safe to delete.");
await wait(3600);

const btn = p.locator('form button[type="submit"]');
console.log("button before:", (await btn.innerText()).trim(), "| enabled:", await btn.isEnabled());
await btn.click();

for (let i=0;i<25;i++){
  const t = (await btn.innerText()).trim();
  const msg = await p.evaluate(()=>document.getElementById("message").value);
  const note = (await p.locator("form p").last().innerText()).trim();
  if (t !== "Send message" || msg === "") { console.log(`t+${i*0.5}s  btn="${t}"  msgEmpty=${msg===""}  note="${note.slice(0,60)}"`); }
  if (msg === "" && t === "Message sent") break;
  await wait(500);
}
console.log("FINAL note:", (await p.locator("form p").last().innerText()).trim());
await b.close();
console.log(errs.length?"ERRORS:\n"+[...new Set(errs)].join("\n"):"no page errors");
