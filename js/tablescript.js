/* ============================
   GLOBAL STATE
============================ */
let data = JSON.parse(localStorage.getItem("siteAccessData")) || [];
let filteredData = [...data];
let currentPage = 1;
let rowsPerPage = 10;

/* ============================
   USER ACCESS CONTROL
============================ */
const emsAccess = localStorage.getItem("emsAccess") || "limited";

/* ============================
   DOM ELEMENTS
============================ */
const tableBody = document.querySelector("#dataTable tbody");
const searchInput = document.getElementById("searchInput");
const filterAccessType = document.getElementById("filterAccessType");
const rowsPerPageSelect = document.getElementById("rowsPerPage");
const pageInfo = document.getElementById("pageInfo");
const importBtn = document.getElementById("importExcelFile");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearDataBtn");
const exportBtn = document.getElementById("exportCsvBtn");

/* ============================
   SAVE TO LOCAL STORAGE
============================ */
function saveData() {
    localStorage.setItem("siteAccessData", JSON.stringify(data));
}

/* ============================
   APPLY FILTERS + SEARCH
============================ */
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const accessFilter = filterAccessType.value;

    filteredData = data.filter(row => {
        const matchesAccess =
            accessFilter === "" || row.accessType === accessFilter;

        const matchesSearch = Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm);

        return matchesAccess && matchesSearch;
    });

    currentPage = 1;
    renderTable();
}

/* ============================
   PAGINATION
============================ */
function paginate(dataArr) {
    if (rowsPerPage === "all") return dataArr;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + parseInt(rowsPerPage);
    return dataArr.slice(start, end);
}

function updatePaginationControls() {
    const totalPages =
        rowsPerPage === "all"
            ? 1
            : Math.ceil(filteredData.length / rowsPerPage);

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

/* ============================
   RENDER TABLE
============================ */
function renderTable() {
    tableBody.innerHTML = "";
    const displayData = paginate(filteredData);

    displayData.forEach((row, index) => {
        const tr = document.createElement("tr");

        Object.entries(row).forEach(([key, value]) => {
            const td = document.createElement("td");
            td.textContent = value;
            if (key === "accessType") {
                td.dataset.type =
                    value === "Jace" ? "Jace" :
                    value === "Sup" ? "Sup" :
                    "Other";
            }
            tr.appendChild(td);
        });

        const actionTd = document.createElement("td");
        actionTd.innerHTML = `
            <button class="action-btn edit-btn"${emsAccess !== "full" ? " disabled" : ""}>Edit</button>
            <button class="action-btn save-btn" style="display:none;"${emsAccess !== "full" ? " disabled" : ""}>Save</button>
            <button class="action-btn delete-btn"${emsAccess !== "full" ? " disabled" : ""}>Delete</button>
        `;
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    });

    updatePaginationControls();
}

/* ============================
   ADD NEW ENTRY
============================ */
addBtn.addEventListener("click", () => {
    if (emsAccess !== "full") return alert("You do not have permission to add entries.");

    const row = {
        siteName: document.getElementById("siteName").value.trim(),
        siteLocation: document.getElementById("siteLocation").value.trim(),
        accessType: document.getElementById("accessType").value.trim(),
        remoteUser: document.getElementById("remoteUser").value.trim(),
        jaceSup: document.getElementById("jaceSup").value.trim(),
        platformUser: document.getElementById("platformUser").value.trim(),
        platformPass: document.getElementById("platformPass").value.trim(),
        stationUser: document.getElementById("stationUser").value.trim(),
        stationPass: document.getElementById("stationPass").value.trim()
    };

    if (!row.siteName || !row.siteLocation) {
        alert("Site Name and Site Location are required.");
        return;
    }

    data.push(row);
    saveData();
    applyFilters();

    document.querySelectorAll(".form-grid input").forEach(i => i.value = "");
});

/* ============================
   DELETE ROW
============================ */
document.addEventListener("click", e => {
    if (e.target.classList.contains("delete-btn")) {
        if (emsAccess !== "full") return alert("You do not have permission to delete rows.");

        const rowIndex = [...tableBody.children].indexOf(e.target.closest("tr"));
        const actualIndex = (rowsPerPage === "all") ? rowIndex : (currentPage - 1) * rowsPerPage + rowIndex;

        data.splice(actualIndex, 1);
        saveData();
        applyFilters();
    }
});

/* ============================
   EDIT ROW
============================ */
document.addEventListener("click", e => {
    if (e.target.classList.contains("edit-btn")) {
        if (emsAccess !== "full") return alert("You do not have permission to edit rows.");

        const tr = e.target.closest("tr");
        tr.querySelectorAll("td:not(:last-child)").forEach(td => {
            td.contentEditable = true;
            td.style.background = "#fff8c6";
        });

        tr.querySelector(".edit-btn").style.display = "none";
        tr.querySelector(".save-btn").style.display = "inline-block";
    }
});

/* ============================
   SAVE EDITED ROW
============================ */
document.addEventListener("click", e => {
    if (e.target.classList.contains("save-btn")) {
        if (emsAccess !== "full") return alert("You do not have permission to save changes.");

        const tr = e.target.closest("tr");
        const rowIndex = [...tableBody.children].indexOf(tr);
        const actualIndex = (rowsPerPage === "all") ? rowIndex : (currentPage - 1) * rowsPerPage + rowIndex;

        const cells = tr.querySelectorAll("td:not(:last-child)");

        data[actualIndex] = {
            siteName: cells[0].innerText.trim(),
            siteLocation: cells[1].innerText.trim(),
            accessType: cells[2].innerText.trim(),
            remoteUser: cells[3].innerText.trim(),
            jaceSup: cells[4].innerText.trim(),
            platformUser: cells[5].innerText.trim(),
            platformPass: cells[6].innerText.trim(),
            stationUser: cells[7].innerText.trim(),
            stationPass: cells[8].innerText.trim()
        };

        saveData();
        applyFilters();
    }
});

/* ============================
   SEARCH AND FILTER EVENTS
============================ */
searchInput.addEventListener("input", applyFilters);
filterAccessType.addEventListener("change", applyFilters);

/* ============================
   PAGINATION EVENTS
============================ */
rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = rowsPerPageSelect.value;
    currentPage = 1;
    renderTable();
});

document.getElementById("prevPageBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
    const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

/* ============================
   CLEAR LOCAL STORAGE
============================ */
clearBtn.addEventListener("click", () => {
    if (emsAccess !== "full") return alert("You do not have permission to clear data.");

    if (confirm("This will delete ALL saved data. Continue?")) {
        localStorage.removeItem("siteAccessData");
        data = [];
        filteredData = [];
        renderTable();
    }
});

/* ============================
   DARK MODE
============================ */
document.getElementById("darkModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

/* ============================
   INITIAL LOAD
============================ */
function restrictButtonsByAccess() {
    if (emsAccess !== "full") {
        importBtn.disabled = true;
        importBtn.style.pointerEvents = "none";
        addBtn.disabled = true;
        clearBtn.disabled = true;
        exportBtn.disabled = false; // Allow CSV export for limited users
    }
}

restrictButtonsByAccess();
applyFilters();

/* ============================
   IMPORT EXCEL
============================ */
importBtn.addEventListener("change", (e) => {
    if (emsAccess !== "full") return alert("You do not have permission to import Excel.");

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        const dataBinary = evt.target.result;
        const workbook = XLSX.read(dataBinary, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        jsonData.forEach(row => {
            data.push({
                siteName: row["Site Name"] || "",
                siteLocation: row["Site Location"] || "",
                accessType: row["Access Type"] || "",
                remoteUser: row["Remote User"] || "",
                jaceSup: row["Jace or Sup"] || "",
                platformUser: row["Platform Username"] || "",
                platformPass: row["Platform Password"] || "",
                stationUser: row["Station Username"] || "",
                stationPass: row["Station Password"] || ""
            });
        });

        saveData();
        applyFilters();
        importBtn.value = "";
    };

    reader.readAsBinaryString(file);
});

/* ============================
   EXPORT TABLE TO CSV
============================ */
function exportToCSV(filename) {
    const rows = [];
    const table = document.getElementById("dataTable");

    for (let row of table.rows) {
        const cells = [...row.cells].map(cell =>
            `"${cell.innerText.replace(/"/g, '""')}"`
        );
        rows.push(cells.join(","));
    }

    const csvData = rows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

exportBtn.addEventListener("click", () => {
    exportToCSV("SiteAccessExport.csv");
});
