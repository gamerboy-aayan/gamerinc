document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const studentContainer = document.getElementById("registeredMembers");

    // Load stored student data
    let students = JSON.parse(localStorage.getItem("students")) || [];

    // Save students to localStorage
    function saveStudents() {
        localStorage.setItem("students", JSON.stringify(students));
    }

    // Render the student list
    function renderStudents() {
        studentContainer.innerHTML = "";
        students.forEach((student, index) => {
            let studentBox = document.createElement("div");
            studentBox.classList.add("student-box");
            studentBox.innerHTML = `
                <div class="student-header">
                    <strong>${student.name}</strong>
                    <span class="dots" onclick="toggleMenu(${index})">⋮</span>
                </div>
                <div class="menu" id="menu-${index}">
                    <button onclick="editStudent(${index})">Edit</button>
                    <button onclick="deleteStudent(${index})">Delete</button>
                </div>
                <p><strong>Class:</strong> ${student.class}</p>
                <p><strong>Section:</strong> ${student.section}</p>
                <p><strong>Roll:</strong> ${student.roll}</p>
                <p><strong>Mobile:</strong> ${student.mobile}</p>
            `;
            studentContainer.appendChild(studentBox);
        });

        // Close the menu when clicking outside
        document.addEventListener("click", (event) => {
            if (!event.target.classList.contains("dots")) {
                document.querySelectorAll(".menu").forEach(menu => menu.style.display = "none");
            }
        });
    }

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const student = {
            name: form.name.value,
            class: form.class.value,
            section: form.section.value,
            roll: form.roll.value,
            mobile: form.mobile.value
        };
        students.push(student);
        saveStudents();
        renderStudents();
        form.reset();
    });

    // Toggle menu visibility
    window.toggleMenu = (index) => {
        document.querySelectorAll(".menu").forEach((menu, i) => {
            menu.style.display = i === index && menu.style.display !== "block" ? "block" : "none";
        });
    };

    // Edit a student entry
    window.editStudent = (index) => {
        let student = students[index];
        form.name.value = student.name;
        form.class.value = student.class;
        form.section.value = student.section;
        form.roll.value = student.roll;
        form.mobile.value = student.mobile;

        students.splice(index, 1);
        saveStudents();
        renderStudents();
    };

    // Delete a student entry
    window.deleteStudent = (index) => {
        students.splice(index, 1);
        saveStudents();
        renderStudents();
    };

    renderStudents();
});
