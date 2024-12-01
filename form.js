const width = window.innerWidth;
const height = window.innerHeight;
const centerContainer = document.getElementById("centerContainer");
centerContainer.style.width = `${width - 100}px`;
centerContainer.style.height = `${height - 100}px`;
let studentNumber;
let students = [];

// Prevent form submission and handle it with AJAX
document.getElementById("numForm").addEventListener("submit", function (event) {
  event.preventDefault();
  changeContainer();
});

document
  .getElementById("mainForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    saveData();
  });

function changeContainer() {
  studentNumber = document.getElementById("stdNum").value;
  const studNumber = Number(studentNumber.trim());

  if (!studentNumber || studNumber <= 0 || isNaN(studNumber)) {
    alert("Please enter a correct number.");
    return;
  }
  showContainer(1);
}

function showContainer(pageNumber) {
  const containers = document.querySelectorAll(".container");
  containers.forEach((container) => container.classList.add("hidden"));

  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => circle.classList.add("hidden"));

  const selectedContainer = document.getElementById("container" + pageNumber);
  const selectedCircle = document.getElementById("c" + pageNumber);

  if (selectedContainer) {
    selectedContainer.classList.remove("hidden");
    selectedCircle.classList.remove("hidden");
  } else {
    console.error("Container not found");
  }
  if (pageNumber === 3) {
    getStds();
  }
}

async function saveData() {
  const id = document.getElementById("id").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const gender = document.getElementById("gender").value;
  const gpa = document.getElementById("gpa").value;
  const level = document.getElementById("level").value;
  const address = document.getElementById("address").value;
  let studentExisting;

  const Url = new URL("http://localhost:8082/api/students/searchByID");
  Url.searchParams.append("id", id);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      studentExisting = await response.json();
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  const regex = /^[A-Za-z\s]+$/;

  if(studentExisting){
    alert("Student Already Exist Please enter another ID. ");
    return; 
  }

  if (!regex.test(firstName)) {
    alert("Please enter a valid first name (letters only).");
    return; 
  }
  if (!regex.test(lastName)) {
    alert("Please enter a valid last name (letters only).");
    return; 
  }
  if (!regex.test(address)) {
    alert("Please enter a valid address (letters only).");
    return; 
  }

  let student = {
    id,
    firstName,
    lastName,
    gender,
    gpa,
    level,
    address,
  };


  students.push(student);
  document.getElementById("mainForm").reset();

  if (--studentNumber > 0) {
    alert("This student added. Enter the next one.");
    showContainer(1);
  } else {
    await sendData();
    showContainer(0);
  }
}

async function sendData() {
  const APIUrl = "http://localhost:8082/api/students";
  for (const student of students) {
    try {
      const response = await fetch(APIUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });
      if (response.ok) {
        console.log("Data successfully sent:", student);
      } else {
        console.error("Failed to submit:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  students = []; // Clear students after sending
}

async function getStdname() {
  const name = document.getElementById("nameSearch").value;
  const Url = new URL("http://localhost:8082/api/students/searchByFirstName");
  Url.searchParams.append("firstName", name);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getStdGPA() {
  const gpa = document.getElementById("GPASearch").value;
  const Url = new URL("http://localhost:8082/api/students/searchByGPA");
  Url.searchParams.append("gpa", gpa);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getStds() {
  const Url = "http://localhost:8082/api/students";
  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentList");
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayStudents(students, ulname) {
  const studentListElement = document.getElementById(ulname);
  studentListElement.innerHTML = "";

  const table = document.createElement("table");
  table.id = "studentTable";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>GPA</th>
        <th>Level</th>
        <th>Address</th>
        <th>Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="student-id">${student.id}</td>
      <td class="student-name">${student.firstName} ${student.lastName}</td>
      <td class="student-gpa">${student.gpa}</td>
      <td class="student-level">${student.level}</td>
      <td class="student-address">${student.address}</td>
      <td>
        <button class="delete-button" onclick="deleteStudent(${student.id})">
          &#128465;
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  studentListElement.appendChild(table);
}

async function deleteStudent(studentId) {
  const Url = new URL("http://localhost:8082/api/students/delete");
  Url.searchParams.append("id", studentId);

  const confirmDelete = confirm(
    "Are you sure you want to delete this student?"
  );
  if (confirmDelete) {
    try {
      const response = await fetch(Url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Student deleted successfully.");
        const row = document
          .querySelector(`.student-id:contains('${studentId}')`)
          .closest("tr");
        row.remove();
      } else {
        console.error("Failed to delete student:", response.statusText);
        alert("Failed to delete student.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
