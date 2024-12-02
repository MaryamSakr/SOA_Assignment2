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
  });

// Go To registeration form after writing number of students
function changeContainer() {
  studentNumber = document.getElementById("stdNum").value;
  const studNumber = Number(studentNumber.trim());

  if (!studentNumber || studNumber <= 0 || isNaN(studNumber)) {
    alert("Please enter a correct number.");
    return;
  }
  showContainer(1);
}

//Go To container after click on option

function showContainer(pageNumber) {
  const containers = document.querySelectorAll(".container");
  containers.forEach((container) => container.classList.add("hidden"));

  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => circle.classList.add("hidden"));

  const selectedContainer = document.getElementById("container" + pageNumber);
  const selectedCircle = document.getElementById("c" + pageNumber);

  if (selectedContainer) {
    console.log(pageNumber);
    selectedContainer.classList.remove("hidden");
    selectedCircle.classList.remove("hidden");
  } else {
    console.error("Container not found");
  }
  if (pageNumber === 3) {
    getStds();
  }
}

//Save data after validate it
async function saveData() {
  const id = document.getElementById("id").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const gender = document.getElementById("gender").value;
  const gpa = document.getElementById("gpa").value;
  const level = document.getElementById("level").value;
  const address = document.getElementById("address").value;
  let studentExisting;

  const Url = new URL("http://localhost:8082/api/students/checkStudentById");
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
  if (studentExisting) {
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

  if (!id || !firstName || !lastName || !gender || !gpa || !level || !address) {
    alert("Please Enter All Data.");
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
    document.getElementById("numForm").reset();
    showContainer(0);
  }
}

//Send the data to the backend

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
  students = [];
}

function getNumberOfStudent(students) {
  const searchDiv = document.getElementById("studentNum");
  searchDiv.innerHTML = `Number Of Students ${students.length}`;
}

//get student from backend with specific name
async function getStdFirstname() {
  const name = document.getElementById("nameSearch").value;
  const Url = new URL("http://localhost:8082/api/students/searchByFirstName");
  Url.searchParams.append("firstName", name);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
      getNumberOfStudent(students);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//get student from backend with specific GPA
async function getStdGPA() {
  const gpa = document.getElementById("GPASearch").value;
  const Url = new URL("http://localhost:8082/api/students/searchByGPA");
  Url.searchParams.append("gpa", gpa);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
      getNumberOfStudent(students);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
//get student from backend with specific GPA
async function getStdLastName() {
  const LastName = document.getElementById("LastNameSearch").value;
  const Url = new URL("http://localhost:8082/api/students/searchByLastName");
  Url.searchParams.append("lastName", LastName);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
      getNumberOfStudent(students);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//get student from backend with specific GPA
async function getStdID() {
  const id = document.getElementById("IDSearch").value;
  const Url = new URL("http://localhost:8082/api/students/searchByID");
  Url.searchParams.append("id", id);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
      getNumberOfStudent(students);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//get student from backend with specific GPA
async function getStdAddress() {
  const address = document.getElementById("AddressSearch").value;
  const Url = new URL("http://localhost:8082/api/students/searchByAddress");
  Url.searchParams.append("address", address);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
      getNumberOfStudent(students);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//get student from backend with specific GPA
async function getStdLevel() {
  const level = document.getElementById("LevelSearch").value;
  const Url = new URL("http://localhost:8082/api/students/searchByLevel");
  Url.searchParams.append("level", level);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
      getNumberOfStudent(students);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//get student from backend with specific Gender
async function getStdGender() {
  const gender = document.getElementById("GenderSearch").value;
  console.log(gender);
  const Url = new URL("http://localhost:8082/api/students/searchByGender");
  Url.searchParams.append("gender", gender);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentsearch");
      getNumberOfStudent(students);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//Get all students from backend
async function getStds() {
  const Url = "http://localhost:8082/api/students";
  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      displayStudents(students, "studentList");
      getNumberOfStudent(students);
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Create table to display students on it
function displayStudents(students, ulname) {
  const studentListElement = document.getElementById(ulname);
  studentListElement.innerHTML = "";

  const table = document.createElement("table");
  table.id = "studentTable";

  const thead = document.createElement("thead");
  thead.innerHTML = `
        <tr style="scrollbar-width: none;">
            <th>ID</th>
            <th>Name</th>
            <th>GPA</th>
            <th>Level</th>
            <th>Address</th>
            <th>Gender</th>
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
            <td class="student-gender">${student.gender}</td>
            <td>
                <button class="update-button" onclick="openUpdateForm(${student.id})" style="background: none; border: none; color: green; font-size:20px;">
                    <i class="fas fa-pencil-alt"></i>
                </button>
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

//Delete student from backend
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
        const row = document
          .querySelector(`.student-id:contains('${studentId}')`)
          .closest("tr");
        row.remove();
        alert("Student deleted successfully.");
      } else {
        console.error("Failed to delete student:", response.statusText);
        alert("Failed to delete student.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function updateStud() {
  const id = document.getElementById("id").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const gender = document.getElementById("gender").value;
  const gpa = document.getElementById("gpa").value;
  const level = document.getElementById("level").value;
  const address = document.getElementById("address").value;

  const regex = /^[A-Za-z\s]+$/;

  console.log(document.getElementById("firstName").value);
  if (
    !regex.test(firstName) &&
    document.getElementById("firstName").value != ""
  ) {
    alert("Please enter a valid first name (letters only).");
    return;
  }
  if (
    !regex.test(lastName) &&
    document.getElementById("lastName").value != ""
  ) {
    alert("Please enter a valid last name (letters only).");
    return;
  }
  if (!regex.test(address) && document.getElementById("address").value != "") {
    alert("Please enter a valid address (letters only).");
    return;
  }

  let updatedStudent = {
    id,
    firstName: firstName || document.getElementById("firstName").placeholder,
    lastName: lastName || document.getElementById("lastName").placeholder,
    gender,
    gpa: gpa || document.getElementById("gpa").placeholder,
    level: level || document.getElementById("level").placeholder,
    address: address || document.getElementById("address").placeholder,
  };

  try {
    const response = await fetch(`http://localhost:8082/api/students/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStudent),
    });

    if (response.ok) {
      alert("Student updated successfully!");
      displayStudents(students, "studentList");
      document.getElementById("mainForm").reset();
      document.getElementById("firstName").placeholder = "";
      document.getElementById("lastName").placeholder = "";
      document.getElementById("gpa").placeholder = "";
      document.getElementById("level").placeholder = "";
      document.getElementById("address").placeholder = "";
      document.getElementById("id").disabled = false;
      document.getElementById("submitButton").textContent = "submit";
      showContainer(3);
    } else {
      console.error("Failed to update student:", response.statusText);
      alert("Error updating student. Please try again.");
    }
  } catch (error) {
    console.error("Error during update:", error);
    alert("An error occurred. Please check your connection.");
  }
}

async function handleSubmit() {
  console.log(document.getElementById("submitButton").textContent);
  if (document.getElementById("submitButton").textContent === "Update") {
    await updateStud();
  } else {
    // Perform add logic
    await saveData();
  }
}

async function openUpdateForm(studentID) {
  const Url = new URL("http://localhost:8082/api/students/searchByID");
  Url.searchParams.append("id", studentID);

  try {
    const response = await fetch(Url);
    const student = await response.json();
    // console.log(student[0].id)

    if (response.ok) {
      const idField = document.getElementById("id");
      idField.value = student[0].id;
      idField.disabled = true;

      // Set placeholders for other fields
      document.getElementById("firstName").placeholder = student[0].firstName;
      document.getElementById("lastName").placeholder = student[0].lastName;
      document.getElementById("gender").value = student[0].gender;
      document.getElementById("gpa").placeholder = student[0].gpa;
      document.getElementById("level").placeholder = student[0].level;
      document.getElementById("address").placeholder = student[0].address;

      // Clear the actual input fields so the user can enter new values
      document.getElementById("firstName").value = "";
      document.getElementById("lastName").value = "";
      document.getElementById("gpa").value = "";
      document.getElementById("level").value = "";
      document.getElementById("address").value = "";
      // console.log()
      // Show the form container
      const containers = document.querySelectorAll(".container");
      containers.forEach((container) => container.classList.add("hidden"));

      const selectedContainer = document.getElementById("container1");
      selectedContainer.classList.remove("hidden");
      document.getElementById("submitButton").textContent = "Update";
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function Sort() {
  const sortValue = document.getElementById("Sort").value;
  const sortOrder = document.getElementById("Order").value;

  const Url = new URL("http://localhost:8082/api/students/sort");
  Url.searchParams.append("attribute", sortValue);

  try {
    const response = await fetch(Url);
    if (response.ok) {
      const students = await response.json();
      if (sortOrder == "Ascending") {
        displayStudents(students, "studentList");
        getNumberOfStudent(students);
      } else {
        students.reverse();
        displayStudents(students, "studentList");
        getNumberOfStudent(students);
      }
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
