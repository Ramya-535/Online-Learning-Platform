import { Request, Response } from "express";
import {
  Assignment,
  Course,
  Mark,
  Student,
  Subject,
} from "../schemas/userSchema";
import { comparePassword, hashPassword } from "../utils/helpers";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
// Login the Student
export const studentLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = req.body;
    const email = body.email;
    const pass = body.password;

    const findUser = await Student.findOne({ studentEmail: email });

    if (!findUser) throw new Error("Student not found");
    if (!comparePassword(pass, (findUser as any).password))
      throw new Error("Password is Wrong");

    const { password, ...withoutPassword } = findUser.toObject();
    return res.send(withoutPassword);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Update Student Profile
export const updateStudentProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = req.params.id;
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const {
      studentName,
      studentEmail,
      mobileNumber,
      //   rollNumber,
      address,
      password,
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Student ID" });
    }
    const student = await Student.findOne({ _id: id });

    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }

    // Check which fields are being updated and validate them as necessary
    if (studentName) student.studentName = studentName;
    if (studentEmail) student.studentEmail = studentEmail;
    if (mobileNumber) student.mobileNumber = mobileNumber;
    if (address) student.address = address;
    // if (rollNumber) student.rollNumber = rollNumber;
    if (password) {
      let hashedPassword = hashPassword(password);
      student.password = hashedPassword;
    }
    if ((req as any).file.path) student.studentPhoto = (req as any).file.path;

    // Save the updated route
    await student.save();

    // const updatedRoute = faculty.toObject();

    res.status(200).json({ msg: "Updated Successfully" });
  } catch (error: any) {
    console.error("Error updating Faculty Profile:", error);
    res
      .status(500)
      .json({ message: "Error updating route", error: error.message });
  }
};

// Change the Password
export const studentchangePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, oldPassword, newPassword, confirmPassword } = req.body;
  try {
    const findStudent = await Student.findOne({ studentEmail: email });
    if (!findStudent)
      return res
        .status(402)
        .send({ error: "Student Not Found with this Email" });
    if (!comparePassword(oldPassword, (findStudent as any).password)) {
      throw new Error("Password Doesnot match");
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(401)
        .send({ error: "NewPassword And Confirm Password Doesnot Match" });
    }

    if (newPassword) {
      let hashedPassword = hashPassword(newPassword);
      findStudent.password = hashedPassword;
    }
    await findStudent.save();

    res.send({ msg: "Password Updated Successfully" });
  } catch (error: any) {
    console.error("Error updating route:", error);
    res
      .status(500)
      .json({ message: "Error updating route", error: error.message });
  }
};

// Getting the courses
export const studentGetCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  const semesterName = req.params.semester;
  try {
    const courses = await Course.find({ semester: semesterName });

    // Transform date field in each course and add a new 'formattedDate' field
    const formattedCourses = courses.map((course) => {
      return {
        ...course.toObject(), // Convert the Mongoose document to a plain JavaScript object
        formattedDate: course.date
          ? new Date(course.date).toLocaleDateString("en-GB")
          : null, // Format as dd-mm-yyyy
      };
    });

    console.log(formattedCourses);
    res.send(formattedCourses);
  } catch (error: any) {
    console.error("Error getting courses:", error);
    res
      .status(500)
      .json({ message: "Error getting courses", error: error.message });
  }
};

// Add Assignment
export const addAssignment = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("request file ", req.file);

  try {
    const { answers, assignmentId, rollNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    // Create a new Faculty instance
    const newAssignment = new Assignment({
      answers,
      assignmentId,
      rollNumber,
      file: req.file.path,
    });
    // Save the new faculty to the database
    const savedAssignment = await newAssignment.save();

    return res.status(201).json({
      message: "Assignment added successfully",
      // faculty: facultyWithoutPassword,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// Get student Marks By roll Number

export const StudentMarks = async (req: Request, res: Response) => {
  const studentRollNumber = req.params.id;
  try {
    const data = await Mark.find({ rollNumber: studentRollNumber });
    res.send(data);
  } catch (error: any) {
    console.error("Error getting Student Marks:", error);
    res
      .status(500)
      .json({ message: "Error getting Student Marks", error: error.message });
  }
};
