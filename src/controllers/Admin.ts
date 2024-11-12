import { Request, Response } from "express";
import { Faculty, Student, Subject } from "../schemas/userSchema";
import { hashPassword } from "../utils/helpers";
import { validationResult } from "express-validator";

export const addFaculty = async (req: Request, res: Response): Promise<any> => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  try {
    const {
      facultyName,
      mobileNumber,
      qualification,
      experience,
      email,
      address,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    let defaultpassword = "123";

    // Hash the password
    let hashedPassword = hashPassword(defaultpassword);

    // Create a new Faculty instance
    const newFaculty = new Faculty({
      facultyName,
      mobileNumber,
      qualification,
      experience,
      email,
      facultyPhoto: req.file.path,
      address,
      password: hashedPassword,
    });
    // Save the new faculty to the database
    const savedFaculty = await newFaculty.save();

    const { password, ...facultyWithoutPassword } = savedFaculty.toObject();
    return res.status(201).json({
      message: "Faculty added successfully",
      // faculty: facultyWithoutPassword,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getFaculties = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const faculties = await Faculty.find().select("-password");

    res.send(faculties);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Admin can delete the faculty
export const deleteFaculty = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const facultyId = req.params.id;
    // Find and delete the product by its ID
    const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);
    return res.status(200).json({
      msg: "Faculty deleted successfully",
      product: deletedFaculty,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin can add the Student
export const addStudent = async (req: Request, res: Response): Promise<any> => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  try {
    const { studentName, studentEmail, mobileNumber, semester, address } =
      req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    let defaultpassword = "123";

    // Hash the password
    let hashedPassword = hashPassword(defaultpassword);

    // Create a new Faculty instance
    const newStudent = new Student({
      studentName,
      studentEmail,
      mobileNumber,
      semester,
      studentPhoto: req.file.path,
      address,
      password: hashedPassword,
    });
    // Save the new faculty to the database
    const savedStudent = await newStudent.save();

    const { password, ...studentWithoutPassword } = savedStudent.toObject();
    return res.status(201).json({
      message: "Student added successfully",
      // studentAdded: studentWithoutPassword,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// Admin can view All the students
export const getStudents = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const students = await Student.find().select("-password");

    res.send(students);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Admin can delete the Student
export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const studentId = req.params.id;
    // Find and delete the product by its ID
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    return res.status(200).json({
      msg: "Student deleted successfully",
      // deleteStudent: deletedStudent,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Adding the subject
export const addSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const { facultyId, facultyName, semester, subjects } = req.body;

    // Create a new Faculty instance
    const newSubject = new Subject({
      facultyId,
      facultyName,
      semester,
      subjects,
    });
    // Save the new faculty to the database
    const savedSubject = await newSubject.save();
    return res.status(201).json({
      message: "Subject added successfully",
      // subjectAdded: savedSubject,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// Admin can view All the Assigned Subjects
export const getSubjects = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const subjects = await Subject.find();

    res.send(subjects);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};
