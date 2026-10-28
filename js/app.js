
/* =====================================================
   SHETIMITRA - FIREBASE APP
   ===================================================== */

const WHATSAPP_NUMBER = "918263833880";
const CONTACT_EMAIL = "pratikshadabhade2011@gmail.com";

const firebaseConfig = {
  apiKey: "AIzaSyA1xXdPrbsGqMWXPRJPeIxf57uMUl_Is1E",
  authDomain: "shetimitra-7a3f3.firebaseapp.com",
  databaseURL: "https://shetimitra-7a3f3-default-rtdb.firebaseio.com",
  projectId: "shetimitra-7a3f3",
  storageBucket: "shetimitra-7a3f3.firebasestorage.app",
  messagingSenderId: "57300259302",
  appId: "1:57300259302:web:1f56c5c9de5d78373bc627",
  measurementId: "G-QENC716W4Q"
};

let db;
let auth;
let firebaseReady = null;

/* FIREBASE INITIALIZATION */
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  auth = firebase.auth();
  db = firebase.firestore();

  firebaseReady = auth.signInAnonymously()
    .then(() => true)
    .catch(error => {
      console.error("Firebase Authentication error:", error);
      throw error;
    });
} catch (error) {
  console.error("Firebase initialization error:", error);
}

/* WORKERS - FIRESTORE */
async function getWorkers() {
  if (!firebaseReady || !db) {
    throw new Error("Firebase सुरू झालेले नाही.");
  }

  await firebaseReady;

  const snapshot = await db.collection("workers")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/* REQUIREMENTS - EXISTING LOCAL STORAGE */
function getRequirements() {
  return JSON.parse(
    localStorage.getItem("farmRequirements") || "[]"
  );
}

/* NOTIFICATIONS - EXISTING LOCAL STORAGE */
function getNotifications() {
  return JSON.parse(
    localStorage.getItem("farmNotifications") || "[]"
  );
}

function addNotification(title, message, data = {}) {
  const notifications = getNotifications();

  notifications.push({
    id: Date.now(),
    title,
    message,
    data,
    createdAt: new Date().toLocaleString("en-IN")
  });

  localStorage.setItem(
    "farmNotifications",
    JSON.stringify(notifications)
  );
}

/* SHOW MESSAGE */
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent = "";
  const box = document.createElement("div");
  box.className = type === "success"
    ? "success-message"
    : "alert error";
  box.textContent = message;
  element.appendChild(box);
}

/* ESCAPE HTML */
function escapeHTML(value) {
  if (value === undefined || value === null) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* WORKER CARD */
function workerCard(worker) {
  const whatsappLink =
    "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(
      "नमस्कार, मला तुमच्याशी शेतीच्या कामाबाबत संपर्क साधायचा आहे."
    );

  const availabilityClass = worker.available
    ? "available"
    : "available unavailable";

  const availabilityText = worker.available
    ? "● कामासाठी उपलब्ध"
    : "● सध्या उपलब्ध नाही";

  const rate = Number(worker.dailyRate) || 0;

  return `
    <div class="worker-card">
      <div class="worker-avatar">👨‍🌾</div>
      <span class="${availabilityClass}">
        ${availabilityText}
      </span>
      <h3>${escapeHTML(worker.name)}</h3>

      <div class="worker-info">
        <p>📍 ${escapeHTML(worker.village)}
          ${worker.district
            ? ", " + escapeHTML(worker.district)
            : ""}
        </p>
        <p>🛠️ ${escapeHTML(worker.skill)}</p>
        <p>⭐ अनुभव: ${escapeHTML(worker.experience)}</p>
      </div>

      <div class="worker-rate">
        ₹${rate.toLocaleString("en-IN")} / दिवस
      </div>

      <a href="${whatsappLink}"
         target="_blank"
         rel="noopener noreferrer"
         class="btn contact-worker">
        💬 संपर्क साधा
      </a>
    </div>`;
}

/* DISPLAY WORKERS FROM FIRESTORE */
async function renderWorkers(elementId) {
  const box = document.getElementById(elementId);
  if (!box) return;

  box.textContent = "कामगारांची माहिती लोड होत आहे...";

  try {
    const workers = await getWorkers();
    renderWorkerData(elementId, workers);
  } catch (error) {
    console.error("Worker loading error:", error);
    box.textContent =
      "कामगारांची माहिती लोड झाली नाही. Firebase Authentication आणि Firestore Rules तपासा.";
  }
}

function renderWorkerData(elementId, workers) {
  const box = document.getElementById(elementId);
  if (!box) return;

  if (!workers.length) {
    box.innerHTML = `
      <div class="empty">
        <h3>अजून कोणताही कामगार उपलब्ध नाही.</h3>
        <p>नवीन कामगार नोंदवण्यासाठी "कामगार जोडा" वर क्लिक करा.</p>
      </div>`;
    return;
  }

  box.innerHTML = workers.map(workerCard).join("");
}

/* WORKER REGISTRATION */
document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("workDate");

  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  const form = document.getElementById("workerForm");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    const worker = {
      name: document.getElementById("workerName").value.trim(),
      mobile: document.getElementById("workerMobile").value.trim(),
      village: document.getElementById("workerVillage").value.trim(),
      district: document.getElementById("workerDistrict").value.trim(),
      skill: document.getElementById("workerSkill").value,
      dailyRate: Number(document.getElementById("dailyRate").value),
      standardHours:
        Number(document.getElementById("standardHours").value) || 8,
      experience: document.getElementById("experience").value,
      available: document.getElementById("available").checked
    };

    if (!/^[6-9]\d{9}$/.test(worker.mobile)) {
      showMessage(
        "workerMessage",
        "कृपया योग्य 10 अंकी भारतीय मोबाईल नंबर टाका.",
        "error"
      );
      return;
    }

    if (!worker.name || !worker.village ||
        !worker.skill || worker.dailyRate <= 0) {
      showMessage(
        "workerMessage",
        "कृपया सर्व आवश्यक माहिती योग्य भरा.",
        "error"
      );
      return;
    }

    if (submitButton) submitButton.disabled = true;

    try {
      if (!firebaseReady || !db) {
        throw new Error("Firebase सुरू झालेले नाही.");
      }

      await firebaseReady;

      await db.collection("workers").add({
        ...worker,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      addNotification(
        "नवीन कामगार नोंदणी",
        worker.name + " यांनी कामगार म्हणून नोंदणी केली आहे."
      );

      showMessage(
        "workerMessage",
        "कामगाराची नोंदणी यशस्वी झाली!",
        "success"
      );

      form.reset();

      const availableCheckbox =
        document.getElementById("available");

      if (availableCheckbox) {
        availableCheckbox.checked = true;
      }

      const hoursInput =
        document.getElementById("standardHours");

      if (hoursInput) hoursInput.value = "8";

    } catch (error) {
      console.error("Worker registration error:", error);

      let message =
        "नोंदणी झाली नाही. इंटरनेट, Authentication आणि Firestore Rules तपासा.";

      if (error.code === "permission-denied") {
        message =
          "परवानगी नाकारली. Firestore Security Rules तपासा.";
      } else if (error.code === "auth/operation-not-allowed") {
        message =
          "Firebase मध्ये Anonymous Sign-in Enable करा.";
      }

      showMessage("workerMessage", message, "error");

    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});
