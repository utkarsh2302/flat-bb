import { chromium } from "playwright";
const OUT="/private/tmp/claude-501/-Users-brickbytes-Desktop-flat-bb-final/0231138a-d490-444b-8400-aeba6ce18421/scratchpad/shots";
const b=await chromium.launch();const c=await b.newContext({viewport:{width:1280,height:900},deviceScaleFactor:2});const p=await c.newPage();
await p.goto("http://localhost:3000/admin/bookings",{waitUntil:"networkidle"});
await p.getByRole("button",{name:"Open file"}).first().click();
await p.waitForTimeout(500);
await p.screenshot({path:`${OUT}/admin-drawer.png`});
await b.close();console.log("shot done");
