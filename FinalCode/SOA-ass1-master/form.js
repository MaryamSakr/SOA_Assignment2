const width = window.innerWidth;
const height = window.innerHeight;
const centerContainer = document.getElementById("centerContainer");
centerContainer.style.width = `${width - 100}px`;
centerContainer.style.height = `${height - 100}px`;
let studentNumber;
let students = [];

function changeContainer() {
  const container1 = document.querySelector(".container1");
  const containerNum = document.querySelector(".containerNum");
  studentNumber = document.getElementById("stdNum").value;

  const studNumber = Number(studentNumber.trim());

  if (!studentNumber || !container1 || !containerNum) {
    console.error("One or more elements not found.");
    return;
  }

  if (studNumber === 0 || studNumber < 0 || isNaN(studNumber)) {
    alert("Please enter a correct number.");
    return;
  }
  showContainer(1);
}

function showContainer(pageNumber) {
  var containers = document.querySelectorAll(".container");
  console.log(containers.length)
  containers.forEach(function (container) {
    console.log(container)
    container.classList.add("hidden");
  });

  var containers = document.querySelectorAll(".circle");
  containers.forEach(function (container) {
    container.classList.add("hidden");
  });

  var selectedContainer = document.getElementById("container" + pageNumber);
  var selectedCircle = document.getElementById("c" + pageNumber);

  if (selectedContainer) {
    selectedContainer.classList.remove("hidden");
    selectedCircle.classList.remove("hidden");
  } else {
    console.error("Container with id container" + pageNumber + " not found");
  }
  if(pageNumber == 3){
    getStds()
  }
} 
document.getElementById("submitButton").addEventListener("click", saveData);

function saveData(event) {
  event.preventDefault();
  const id = document.getElementById("id").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const gender = document.getElementById("gender").value;
  const gpa = document.getElementById("gpa").value;
  const level = document.getElementById("level").value;
  const address = document.getElementById("address").value;
  let student;

  if (studentNumber > 1) {
    student = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      gpa: gpa,
      level: level,
      address: address,
    };
    students.push(student);
    console.log(students, studentNumber);
    studentNumber--;
    alert("this student added enter the next one");
    document.getElementById("mainForm").reset();
    showContainer(1);
    
  } else {
    student = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      gpa: gpa,
      level: level,
      address: address,
    };
    students.push(student);
    document.getElementById("mainForm").reset();
    document.getElementById("numForm").reset();

    sendData();
    showContainer(0);
  }
}

async function sendData() {

      for (let i = 0; i <students.length ; i++) {
        console.log(students[i])
        const APIUrl = "http://localhost:8081/api/students";
        try {
          const response = await fetch(APIUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(students[i]),
          });
          if (response.ok) {
            console.log("Data successfully sent:", students[i]);
          } else {
            console.error("Failed to submit:", response.statusText);
            alert("Error: " + response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
        
      }
    }

    async function getStdname() {
      const name = document.getElementById("nameSearch").value;
      const Url = new URL("http://localhost:8081/api/students/searchByFirstName");
      Url.searchParams.append("firstName", name);

      try {
        const response = await fetch(Url, {
          method: "GET", 
        });

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
      const Url = new URL(
        "http://localhost:8081/api/students/searchByGPA"
      );
      Url.searchParams.append("gpa", gpa);

    
      try {
        const response = await fetch(Url, {
          method: "GET",
        });

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
      const gpa = document.getElementById("GPASearch").value;
      const Url = new URL("http://localhost:8081/api/students");
      Url.searchParams.append("gpa", gpa);

      try {
        const response = await fetch(Url, {
          method: "GET",
        });

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
  studentListElement.innerHTML = ""; // Clear previous content

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
        <th>Actions</th> <!-- Add a new column for actions -->
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
          &#128465; <!-- Unicode trash icon -->
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  studentListElement.appendChild(table);
}




async function deleteStudent(studentId) {
 const Url = new URL("http://localhost:8081/api/students/delete");
 Url.searchParams.append("id", studentId);
  const confirmDelete = confirm(
    "Are you sure you want to delete this student?"
  );
  if (confirmDelete) {
    try {
        

      const response = await fetch(
        Url,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
