document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        window.location.href = "index.html"; // Redirect to login if not authenticated
    }

    document.getElementById("userRole").innerText = `Role: ${role}`;

    // Show bug reporting form only for testers
    if (role === "tester") {
        document.getElementById("reportBugForm").style.display = "block";
    }
    
    // Show developer emails section only for admin
    if (role === "admin") {
        document.getElementById("developerEmailsSection").style.display = "block";
        await loadDevelopers();
    }

    await loadBugs();
});

// Function to load all developers (only for admin)
async function loadDevelopers() {
    const response = await fetch("http://localhost:5000/api/users/developers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    
    if (!response.ok) {
        document.getElementById("developerList").innerHTML = 
            '<tr><td colspan="3" class="text-center">Failed to load developers</td></tr>';
        return;
    }
    
    const developers = await response.json();
    const developerList = document.getElementById("developerList");
    developerList.innerHTML = ""; // Clear previous data
    
    if (developers.length === 0) {
        developerList.innerHTML = '<tr><td colspan="3" class="text-center">No developers registered</td></tr>';
        return;
    }
    
    // Add each developer to the table
    developers.forEach((developer) => {
        developerList.innerHTML += `
            <tr>
                <td>${developer.name || 'N/A'}</td>
                <td>${developer.email}</td>
            </tr>
        `;
    });
}

// Fetch and display bugs
async function loadBugs() {
    const response = await fetch("http://localhost:5000/api/bugs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const bugs = await response.json();
    const bugList = document.getElementById("bugList");
    bugList.innerHTML = ""; // Clear previous data

    bugs.forEach((bug) => {
        bugList.innerHTML += `
            <tr>
                <td>${bug._id}</td>
                <td>${bug.title}</td>
                <td>${bug.description}</td>
                <td>${bug.status}</td>
                <td>${bug.createdBy?.name || "Unassigned"}</td>
                <td>${bug.assignedTo?.name || "Unassigned"}</td>
                <td>
                    ${localStorage.getItem("role") === "admin" ? `
                        <button onclick="assignBug('${bug._id}')" class="btn btn-warning">Assign</button>
                        <button onclick="deleteBug('${bug._id}')" class="btn btn-danger">Delete</button>
                    ` : ""}
                    ${localStorage.getItem("role") === "developer" ? `
                        <button onclick="resolveBug('${bug._id}')" class="btn btn-success">Resolved</button>
                        <button onclick="progressBug('${bug._id}')" class="btn btn-primary">In Progress</button>
                        <button onclick="rejectBug('${bug._id}')" class="btn btn-danger">Rejected</button>
                    ` : ""}
                </td>
            </tr>
        `;
    });
}

//Only for testers ->

document.getElementById("bugForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("bugTitle").value;
    const description = document.getElementById("bugDescription").value;

    const response = await fetch("http://localhost:5000/api/bugs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ title, description })
    });

    if (response.ok) {
        alert("Bug reported successfully!");
        document.getElementById("bugForm").reset();
        loadBugs();
    } else {
        alert("Failed to report bug.");
    }
});

//Developer: Update Bug Status

//Resolve
async function resolveBug(bugId) {
    const response = await fetch(`http://localhost:5000/api/bugs/${bugId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: "Resolved" })
    });

    if (response.ok) {
        alert("Bug marked as Resolved!");
        loadBugs();
    } else {
        alert("Failed to update bug.");
    }
}

//In Progress
async function progressBug(bugId) {
    const response = await fetch(`http://localhost:5000/api/bugs/${bugId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: "In Progress" })
    });

    if (response.ok) {
        alert("Bug marked as In Progress!");
        loadBugs();
    } else {
        alert("Failed to update bug.");
    }
}

//Rejected
async function rejectBug(bugId) {
    const response = await fetch(`http://localhost:5000/api/bugs/${bugId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: "Rejected" })
    });

    if (response.ok) {
        alert("Bug marked as Rejected!");
        loadBugs();
    } else {
        alert("Failed to update bug.");
    }
}

async function assignBug(bugId) {
    const assignedTo = prompt("Enter Developer's Email:");
    if (!assignedTo) return;

    const response = await fetch(`http://localhost:5000/api/bugs/${bugId}/assign`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ assignedTo })
    });

    if (response.ok) {
        alert("Bug assigned successfully!");
        loadBugs();
    } else {
        alert("Failed to assign bug.");
    }
}

async function deleteBug(bugId) {
    if (!confirm("Are you sure you want to delete this bug?")) return;

    const response = await fetch(`http://localhost:5000/api/bugs/${bugId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    if (response.ok) {
        alert("Bug deleted successfully!");
        loadBugs();
    } else {
        alert("Failed to delete bug.");
    }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});