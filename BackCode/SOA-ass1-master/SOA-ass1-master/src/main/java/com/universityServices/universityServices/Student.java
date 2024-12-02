package com.universityServices.universityServices;
public class Student {
    private String id;
    private String firstName;
    private String lastName;
    private String gender;
    private double gpa;
    private int level;
    private String address;

    // Constructor
    public Student(String id, String firstName, String lastName, String gender, double gpa, int level, String address) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.gpa = gpa;
        this.level = level;
        this.address = address;
    }
    // Getters and setters
    public String getId() {
        return id;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public String getGender() {
        return gender;
    }
    public int getLevel() {
        return level;
    }
    public double getGpa() {
        return gpa;
    }
    public String getAddress() {
        return address;
    }
    public void setId(String id) {
        this.id = id;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public void setGpa(double gpa) {
        this.gpa = gpa;
    }
    public void setLevel(int level) {
        this.level = level;
    }
    public void setAddress(String address) {
        this.address = address;
    }
}