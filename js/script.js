document.addEventListener('DOMContentLoaded', function () {
  // Contact Form Thank You
  const contactForm = document.getElementById('contactForm');
  const thankYou = document.getElementById('thankYouMessage');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      thankYou.classList.remove('d-none');
      contactForm.reset();
    });
  }

  // Registration
  const registerForm = document.getElementById('registerForm');
  const registerSuccess = document.getElementById('registerSuccess');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('regEmail').value;
      const pass = document.getElementById('regPassword').value;
      localStorage.setItem('emsUser', JSON.stringify({ email, pass }));
      registerSuccess.classList.remove('d-none');
      registerForm.reset();
    });
  }

  // Login
  const loginForm = document.getElementById('loginForm');
  const loginSuccess = document.getElementById('loginSuccess');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const stored = JSON.parse(localStorage.getItem('emsUser'));
      const email = document.getElementById('loginEmail').value;
      const pass = document.getElementById('loginPassword').value;
      const passphrase = document.getElementById('loginPassphrase').value.trim();

      if (stored && stored.email === email && stored.pass === pass) {
        loginSuccess.classList.remove('d-none');
  // Restrict access for Controls
        if (passphrase === 'Unihvac123') { // Full access for Controls
          localStorage.setItem('emsAccess', 'full');
          setTimeout(() => window.location.href = 'ems-sites.html', 1500);
		  
        }
  // Restrict access for Portfolio
		else if (passphrase === 'Unihvac@123') {
          localStorage.setItem('emsAccess', 'full');
          setTimeout(() => window.location.href = 'https://jay19991.github.io/portfolio/', 1500);
        }
		else {
          localStorage.setItem('emsAccess', 'limited');
          setTimeout(() => window.location.href = 'procedures.html', 1500);
        }
      } else {
        alert('Invalid credentials or please register first.');
      }
    });
  }
		
  // Restrict access
  const path = window.location.pathname;
  if (path.includes('ems-sites.html') || path.includes('ems-sites1.html') || path.includes('table.html') || path.includes('procedures.html'))  {
    const access = localStorage.getItem('emsAccess');
    if (!access) {
      alert('Please log in to access this page.');
      window.location.href = 'login.html';
    }
    if (path.includes('ems-sites.html') && access !== 'full') {
      alert('You do not have permission to view this page, Passphrase required to view this page.');
      window.location.href = 'ems-sites1.html';
    }
	else if (path.includes('table.html') && access !== 'full') {
      alert('You do not have permission to view this page, Passphrase required to view this page.');
      window.location.href = 'ems-sites1.html';
    }
  }
});

//Procedure Page
//BAS Step by Step Procedures 
const stepDetails = {
  1: {description: "<ul><li>Define project scope and goals</li><li>Conduct site surveys</li><li>Prepare project charter</li></ul>"},
  2: {description: "<ul><li>Design network architecture</li><li>Select sensors/controllers</li><li>Prepare control logic</li></ul>"},
  3: {description: "<ul><li>Create wiring diagrams</li><li>Develop I/O lists</li><li>Prepare Bill of Materials</li></ul>"},
  4: {description: "<ul><li>Assemble panels</li><li>Develop software</li><li>Integrate systems</li></ul>"},
  5: {description: "<ul><li>Install sensors and controllers</li><li>Cable termination</li><li>Ensure compliance</li></ul>"},
  6: {description: "<ul><li>Point-to-point tests</li><li>Calibrate devices</li><li>System acceptance</li></ul>"},
  7: {description: "<ul><li>Submit documentation</li><li>Train staff</li><li>Obtain client sign-off</li></ul>"},
  8: {description: "<ul><li>Perform preventive maintenance</li><li>Monitor performance</li><li>Implement updates</li></ul>"}
};

// Show description below each step on click
document.querySelectorAll(".flow-node").forEach(node => {
  node.addEventListener("click", () => {
    const stepId = node.dataset.step;
    const descDiv = node.querySelector(".step-desc");

    descDiv.style.width = node.querySelector(".content").offsetWidth + "px";
    descDiv.innerHTML = stepDetails[stepId].description;
    descDiv.style.display = "block";

    drawCurves();

    setTimeout(() => {
      descDiv.style.display = "none";
      drawCurves();
    }, 10000);
  });
});

// Animate nodes sequentially
window.addEventListener("load", () => {
  const nodes = document.querySelectorAll(".flow-node");
  nodes.forEach((node, index) => {
    setTimeout(() => {
      node.classList.add("visible", "animate__animated", "animate__fadeInUp");
    }, index * 400);
  });

  drawCurves();
});

// Draw smooth responsive curved lines relative to container
function drawCurves() {
  const nodes = document.querySelectorAll(".flow-node");
  const svg = document.querySelector('.flow-svg');
  const containerRect = svg.parentElement.getBoundingClientRect();

  nodes.forEach((node, i) => {
    const curve = document.getElementById(`curve${i+1}`);
    if(!curve || i === nodes.length-1) return;

    const start = node.getBoundingClientRect();
    const end = nodes[i+1].getBoundingClientRect();

    let x1 = start.left + start.width/2 - containerRect.left;
    let y1 = start.top + start.height/2 - containerRect.top;
    let x2 = end.left + end.width/2 - containerRect.left;
    let y2 = end.top + end.height/2 - containerRect.top;

    // Smooth curve control points
    const dx = (x2 - x1) / 2;
    const dy = Math.min(Math.abs(y2 - y1)/2, 100);

    const cx1 = x1 + dx;
    const cy1 = y1;
    const cx2 = x2 - dx;
    const cy2 = y2;

    curve.setAttribute("d", `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
    curve.style.strokeDasharray = curve.getTotalLength();
    curve.style.strokeDashoffset = curve.getTotalLength();
    curve.style.animation = `drawCurve 1.5s forwards ${i*0.3}s`;
  });
}

// Redraw curves on window resize
window.addEventListener('resize', drawCurves);



// Live Data Monitoring ECY-303
const baseURL = "https://192.168.105.2";
const credentials = btoa("admin:Unihvac123");
const headers = { "Authorization": "Basic " + credentials };

const points = [
  "analog-input/101","analog-input/102","binary-input/103",
  "binary-input/104","binary-input/105","analog-input/106",
  "analog-input/107","analog-input/108",
  "binary-output/101","binary-output/102","binary-output/103",
  "binary-output/104","binary-output/105","binary-output/106",
  "analog-output/107","binary-output/108"
];

const historyData = {};
const unitsData = {};
points.forEach(p => { historyData[p] = []; unitsData[p] = ""; });

async function fetchProperty(point, property) {
  try {
    const res = await fetch(`${baseURL}/api/rest/v1/protocols/bacnet/local/objects/${point}/properties/${property}`, { headers });
    const data = await res.json();
    return data?.value ?? null;
  } catch { return null; }
}

async function buildTable() {
  const tbody = document.getElementById("data-body");
  tbody.innerHTML = "";

  for (const point of points) {
    const objectName = point;
    let name = await fetchProperty(point, "description");
    if (!name) name = await(fetchProperty(point, "object-name"));

    let unit = await fetchProperty(point, "units");
    unitsData[point] = unit || "";

    const row = document.createElement("tr");
    row.setAttribute("data-point", point);

    const objectNameCell = document.createElement("td");
    objectNameCell.textContent = objectName;

    const nameCell = document.createElement("td");
    nameCell.textContent = name || objectName;

    const valueCell = document.createElement("td");
    valueCell.classList.add("value-cell");
    valueCell.innerHTML = `
      <span class="value-text">Loading</span>
      ${unit ? `<span class="unit">${unit}</span>` : ""}
      <span class="trend-icon">📈</span>
    `;

    row.appendChild(objectNameCell);
    row.appendChild(nameCell);
    row.appendChild(valueCell);
    tbody.appendChild(row);
  }

  await updateValues();
}

// Update values every 15s
async function updateValues() {
  const rows = document.querySelectorAll("#data-body tr");

  for (const row of rows) {
    const point = row.getAttribute("data-point");
    const valueCell = row.querySelector(".value-cell");
    valueCell.classList.remove("binaryoverride","fault");

    try {
      const value = await fetchProperty(point, "present-value");
      let displayValue = value;

      if (typeof value === "boolean" || value === 0 || value === 1) displayValue = value ? "ON" : "OFF";
      else if (!isNaN(value)) displayValue = parseFloat(value).toFixed(2);

      const status = await fetchProperty(point, "status");
      if ((value === "BinaryOverrideValue" || value === "binaryoverride") && status === "active") {
        valueCell.classList.add("binaryoverride");
      } else if (value === "fault") {
        valueCell.classList.add("fault");
      }

      valueCell.querySelector(".value-text").textContent = displayValue;

      const unitSpan = valueCell.querySelector(".unit");
      if (unitSpan) unitSpan.textContent = unitsData[point];

      historyData[point].push({ time: new Date(), value: parseFloat(displayValue) || 0 });
      if (historyData[point].length > 200000) historyData[point].shift();
    } catch {
      valueCell.querySelector(".value-text").textContent = "Error";
    }
  }

  document.getElementById("last-updated").textContent = "Last updated: " + new Date().toLocaleTimeString();
}

// Trend modal setup
const modal = document.getElementById("trend-modal");
const modalTitle = document.getElementById("modal-title");
const modalCanvas = document.getElementById("trend-chart");
const trendRangeSelect = document.getElementById("trend-range");
let trendChart = null;
let currentPoint = null;

function openTrendModal(point) {
  currentPoint = point;
  modalTitle.textContent = "Trend: " + point;
  modal.style.display = "block";
  updateTrendChart();
}

function updateTrendChart() {
  const rangeMinutes = parseInt(trendRangeSelect.value);
  const now = new Date();

  const filteredData = historyData[currentPoint].filter(item => (now - item.time) / 60000 <= rangeMinutes);

  let sampledData = filteredData;
  if (filteredData.length > 1000) {
    const step = Math.ceil(filteredData.length / 1000);
    sampledData = filteredData.filter((_, i) => i % step === 0);
  }

  const labels = sampledData.map(item => item.time.toLocaleString());
  const values = sampledData.map(item => item.value);

  if (trendChart) trendChart.destroy();
  trendChart = new Chart(modalCanvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: currentPoint, data: values, borderColor: '#0073c0', backgroundColor: 'rgba(0,115,192,0.2)', tension: 0.3 }]
    },
    options: {
      scales: {
        x: { display: true, title: { display: true, text: 'Time' } },
        y: { display: true, beginAtZero: false, title: { display: true, text: 'Value' } }
      },
      interaction: { mode: 'nearest', intersect: false },
      plugins: { tooltip: { enabled: true } }
    }
  });
}

// Event delegation for trend icon click
document.getElementById("data-body").addEventListener("click", e => {
  if (e.target.classList.contains("trend-icon")) {
    const point = e.target.closest("tr").getAttribute("data-point");
    openTrendModal(point);
  }
});

trendRangeSelect.onchange = () => { if (currentPoint) updateTrendChart(); };
document.querySelector(".close").onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

buildTable();
setInterval(updateValues, 15000); // 15-second interval
