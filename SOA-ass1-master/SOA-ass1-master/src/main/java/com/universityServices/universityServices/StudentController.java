package com.universityServices.universityServices;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import javax.xml.transform.OutputKeys;
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class StudentController {
    private final List<Student> students;
    private final String xmlFilePath = "Students.xml";
    public StudentController() {
        students = new ArrayList<>();
        loadFromXml();
    }
    // Load from XML
    public String loadFromXml() {
        try {
            File xmlFile = new ClassPathResource(xmlFilePath).getFile();
            if (xmlFile.exists()) {
                DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
                DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
                Document doc = dBuilder.parse(xmlFile);
                doc.getDocumentElement().normalize();
                NodeList nList = doc.getElementsByTagName("Student");
                for (int i = 0; i < nList.getLength(); i++) {
                    Node node = nList.item(i);
                    if (node.getNodeType() == Node.ELEMENT_NODE) {
                        Element elem = (Element) node;
                        students.add(new Student(
                                elem.getAttribute("ID"),
                                elem.getElementsByTagName("FirstName").item(0).getTextContent(),
                                elem.getElementsByTagName("LastName").item(0).getTextContent(),
                                elem.getElementsByTagName("Gender").item(0).getTextContent(),
                                Double.parseDouble(elem.getElementsByTagName("GPA").item(0).getTextContent()),
                                Integer.parseInt(elem.getElementsByTagName("Level").item(0).getTextContent()),
                                elem.getElementsByTagName("Address").item(0).getTextContent()
                        ));
                    }
                }
                return "File loaded: " + students.size() + " students";
            } else {
                return "File does not exist";
            }
        } catch (Exception e) {
            return "Error loading XML: " + e.getMessage();
        }
    }
    // Utility method to add XML elements
    private void appendChildElement(Document doc, Element parent, String tagName, String value) {
        Element element = doc.createElement(tagName);
        element.appendChild(doc.createTextNode(value));
        parent.appendChild(element);
    }
    // Save to XML
    public String saveToXml() {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.newDocument();
            Element rootElement = doc.createElement("University");
            doc.appendChild(rootElement);
            for (Student student : students) {
                Element studentElement = doc.createElement("Student");
                studentElement.setAttribute("ID", student.getId());
                appendChildElement(doc, studentElement, "FirstName", student.getFirstName());
                appendChildElement(doc, studentElement, "LastName", student.getLastName());
                appendChildElement(doc, studentElement, "Gender", student.getGender());
                appendChildElement(doc, studentElement, "GPA", String.valueOf(student.getGpa()));
                appendChildElement(doc, studentElement, "Level", String.valueOf(student.getLevel()));
                appendChildElement(doc, studentElement, "Address", student.getAddress());
                rootElement.appendChild(studentElement);
            }
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
            DOMSource source = new DOMSource(doc);
            File xmlFile = new ClassPathResource(xmlFilePath).getFile();
            StreamResult result = new StreamResult(xmlFile);
            transformer.transform(source, result);
            return "XML file updated successfully";
        } catch (Exception e) {
            return "Error saving XML: " + e.getMessage();
        }
    }
    public List<Student> searchGPA(double gpa){
        List<Student> stud = new ArrayList<>();
        for (Student student : students){
            if(student.getGpa() == gpa){
                stud.add(student);
            }
        }
        return stud;
    }
    public List<Student> searchFirstName(String firstName) {
        List<Student> matchingStudents = new ArrayList<>();
        for (Student student : students) {
            // Adjusted to case-insensitive comparison
            if (student.getFirstName().equalsIgnoreCase(firstName)) {
                matchingStudents.add(student);
            }
        }
        return matchingStudents;
    }
    public List<Student> searchLastName(String lastName) {
        List<Student> matchingStudents = new ArrayList<>();
        for (Student student : students) {
            // Adjusted to case-insensitive comparison
            if (student.getLastName().equalsIgnoreCase(lastName)) {
                matchingStudents.add(student);
            }
        }
        return matchingStudents;
    }
    public List<Student> searchGender(String gender) {
        List<Student> matchingStudents = new ArrayList<>();
        for (Student student : students) {
            // Adjusted to case-insensitive comparison
            if (student.getGender().equalsIgnoreCase(gender)) {
                matchingStudents.add(student);
            }
        }
        return matchingStudents;
    }
    public List<Student> searchLevel(int level) {
        List<Student> matchingStudents = new ArrayList<>();
        for (Student student : students) {
            // Adjusted to case-insensitive comparison
            if (student.getLevel() == level) {
                matchingStudents.add(student);
            }
        }
        return matchingStudents;
    }
    public List<Student> searchAddress(String address) {
        List<Student> matchingStudents = new ArrayList<>();
        for (Student student : students) {
            // Adjusted to case-insensitive comparison
            if (student.getAddress().equalsIgnoreCase(address)) {
                matchingStudents.add(student);
            }
        }
        return matchingStudents;
    }
    public Boolean searchID(String id) {
        List<Student> matchingStudents = new ArrayList<>();
        for (Student student : students) {
            if (student.getId().equalsIgnoreCase(id)) {
               return true;
            }
        }
        return false;
    }
    public String updateByID(Student stud){
        for (Student student: students) {
            if(student.getId().equals(stud.getId())){
                student.setFirstName(stud.getFirstName());
                student.setLastName(stud.getLastName());
                student.setGpa(stud.getGpa());
                student.setGender(stud.getGender());
                student.setLevel(stud.getLevel());
                student.setAddress(stud.getAddress());
                break;
            }
        }
        return saveToXml();
    }
    public String deleteByID(String id){
        students.removeIf(student -> student.getId().equals(id));
        return saveToXml();
    }
    public List<Student> sortStudents(String attribute) {
        if (attribute.equals("id")) {
            students.sort(Comparator.comparing(Student::getId));
        } else if (attribute.equals("firstName")) {
            students.sort(Comparator.comparing(Student::getFirstName));
        } else if (attribute.equals("lastName")) {
            students.sort(Comparator.comparing(Student::getLastName));
        } else if (attribute.equals("gender")) {
            students.sort(Comparator.comparing(Student::getGender));
        } else if (attribute.equals("gpa")) {
            students.sort(Comparator.comparing(Student::getGpa));
        } else if (attribute.equals("level")) {
            students.sort(Comparator.comparing(Student::getLevel));
        } else if (attribute.equals("address")) {
            students.sort(Comparator.comparing(Student::getAddress));
        } else {
            throw new IllegalArgumentException("Invalid attribute: " + attribute);
        }
        saveToXml();
        return students;
    }

    // REST Endpoints
    @GetMapping
    public List<Student> getStudents() {
        return students;
    }
    @PostMapping
    public String addStudent(@RequestBody Student student) {
        for (Student stud : students) {
            if(student.getId().equals(stud.getId())){
                return "Id repeated";
            }
        }
        students.add(student);
        return saveToXml();
    }
    @GetMapping("/searchByGPA")
    public List<Student> getStudentGPA(@RequestParam("gpa") double gpa){
        return searchGPA(gpa);
    }
    @GetMapping("/searchByFirstName")
    public List<Student> getStudentByFirstName(@RequestParam("firstName") String firstName) {
        return searchFirstName(firstName);
    }
    @GetMapping("/searchByLastName")
    public List<Student> getStudentByLastName(@RequestParam("lastName") String lastName) {
        return searchLastName(lastName);
    }
    @GetMapping("/searchByGender")
    public List<Student> getStudentByGender(@RequestParam("gender") String gender) {
        return searchGender(gender);
    }
    @GetMapping("/searchByLevel")
    public List<Student> getStudentByLevel(@RequestParam("level") int level) {
        return searchLevel(level);
    }
    @GetMapping("/searchByAddress")
    public List<Student> getStudentByAddress(@RequestParam("address") String address) {
        return searchAddress(address);
    }
    @GetMapping("/searchByID")
    public Boolean getStudentByID(@RequestParam("id") String id) {
        return searchID(id);
    }
    @DeleteMapping("/delete")
    public String deleteStudent(@RequestParam("id") String id){
        return deleteByID(id);
    }
    @PatchMapping("/update")
    public String updateStudent(@RequestBody Student student){
        return updateByID(student);
    }
    @GetMapping("/sort")
    public List<Student> sortByAttribute(@RequestParam("attribute") String attribute) {
        return sortStudents(attribute);
    }
}
