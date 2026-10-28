/* =========================================================
   FARM WORKER SERVICE - MAIN JAVASCRIPT
   ========================================================= */

const WHATSAPP_NUMBER = "918263833880";
const CONTACT_EMAIL = "pratikshadabhade2011@gmail.com";


/* =========================
   WORKERS
========================= */

function getWorkers(){

return JSON.parse(
localStorage.getItem("farmWorkers") || "[]"
);

}


/* =========================
   REQUIREMENTS
========================= */

function getRequirements(){

return JSON.parse(
localStorage.getItem("farmRequirements") || "[]"
);

}


/* =========================
   NOTIFICATIONS
========================= */

function getNotifications(){

return JSON.parse(
localStorage.getItem("farmNotifications") || "[]"
);

}


function addNotification(title,message,data={}){

const notifications=getNotifications();

notifications.push({

id:Date.now(),

title:title,

message:message,

data:data,

createdAt:new Date().toLocaleString("en-IN")

});

localStorage.setItem(
"farmNotifications",
JSON.stringify(notifications)
);

}


/* =========================
   SHOW MESSAGE
========================= */

function showMessage(elementId,message,type){

const element=document.getElementById(elementId);

if(!element)return;

if(type==="success"){

element.innerHTML=
`<div class="success-message">${message}</div>`;

}else{

element.innerHTML=
`<div class="alert error">${message}</div>`;

}

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value){

if(value===undefined || value===null){
return "";
}

return String(value)
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");

}


/* =========================
   WORKER CARD
========================= */

function workerCard(worker){

const whatsappLink=
"https://wa.me/" +
WHATSAPP_NUMBER +
"?text=" +
encodeURIComponent(
"नमस्कार, मला तुमच्याशी शेतीच्या कामाबाबत संपर्क साधायचा आहे."
);

const availabilityClass=
worker.available ?
"available" :
"available unavailable";

const availabilityText=
worker.available ?
"● कामासाठी उपलब्ध" :
"● सध्या उपलब्ध नाही";

const rate=Number(worker.dailyRate)||0;

return `

<div class="worker-card">

<div class="worker-avatar">
👨‍🌾
</div>

<span class="${availabilityClass}">
${availabilityText}
</span>

<h3>${escapeHTML(worker.name)}</h3>

<div class="worker-info">

<p>📍 ${escapeHTML(worker.village)}
${worker.district ?
", "+escapeHTML(worker.district):""}
</p>

<p>🛠️ ${escapeHTML(worker.skill)}</p>

<p>⭐ अनुभव: ${escapeHTML(worker.experience)}</p>

</div>

<div class="worker-rate">
₹${rate.toLocaleString("en-IN")} / दिवस
</div>

<div class="percent">
75%
</div>

<a
href="${whatsappLink}"
target="_blank"
class="btn contact-worker">
💬 संपर्क साधा
</a>

</div>

`;

}


/* =========================
   RENDER ALL WORKERS
========================= */

function renderWorkers(elementId){

const workers=getWorkers();

renderWorkerData(elementId,workers);

}


function renderWorkerData(elementId,workers){

const box=document.getElementById(elementId);

if(!box)return;

if(!workers.length){

box.innerHTML=`

<div class="empty">

<h3>अजून कोणताही कामगार उपलब्ध नाही.</h3>

<p>
नवीन कामगार नोंदवण्यासाठी
"कामगार जोडा" वर क्लिक करा.
</p>

</div>

`;

return;

}

box.innerHTML=
workers.map(workerCard).join("");

}


/* =========================
   AUTO SET DATE
========================= */

document.addEventListener(
"DOMContentLoaded",
function(){

const dateInput=
document.getElementById("workDate");

if(dateInput){

const today=
new Date().toISOString().split("T")[0];

dateInput.min=today;

}

}
);
