import { Request, Response } from "express";
import { Faculty, Student, Subject } from "../schemas/userSchema";
import { comparePassword, hashPassword } from "../utils/helpers";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
// Login the Faculty
export const facultyLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = req.body;
    const email = body.email;
    const pass = body.password;

    const findUser = await Faculty.findOne({ email: email });

    if (!findUser) throw new Error("Faculty not found");
    if (!comparePassword(pass, (findUser as any).password))
      throw new Error("Bad Credentials");

    const { password, ...withoutPassword } = findUser.toObject();
    return res.send(withoutPassword);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Update Faculty Profile
export const updateFacultyProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = req.params.id;
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const {
      facultyName,
      mobileNumber,
      qualification,
      experience,
      email,
      address,
      password,
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Faculty ID" });
    }
    const faculty = await Faculty.findOne({ _id: id });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Check which fields are being updated and validate them as necessary
    if (facultyName) faculty.facultyName = facultyName;
    if (mobileNumber) faculty.mobileNumber = mobileNumber;
    if (qualification) faculty.qualification = qualification;
    if (experience) faculty.experience = experience;
    if (email) faculty.email = email;
    if (address) faculty.address = address;
    if (password) {
      let hashedPassword = hashPassword(password);
      faculty.password = hashedPassword;
    }
    if ((req as any).file.path) faculty.facultyPhoto = (req as any).file.path;

    // Save the updated route
    await faculty.save();

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
export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, oldPassword, newPassword, confirmPassword } = req.body;
  try {
    const findFaculty = await Faculty.findOne({ email: email });
    if (!findFaculty)
      return res
        .status(402)
        .send({ error: "Faculty Not Found with this Email" });
    if (!comparePassword(oldPassword, (findFaculty as any).password)) {
      throw new Error("Password Doesnot match");
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(401)
        .send({ error: "NewPassword And Confirm Password Doesnot Match" });
    }

    if (newPassword) {
      let hashedPassword = hashPassword(newPassword);
      findFaculty.password = hashedPassword;
    }
    await findFaculty.save();

    res.send({ msg: "Password Updated Successfully" });
  } catch (error: any) {
    console.error("Error updating route:", error);
    res
      .status(500)
      .json({ message: "Error updating route", error: error.message });
  }
};

// Get the students
export const getStudent = async (req: Request, res: Response) => {
  try {
    const result = await Student.find();
    res.send(result);
  } catch (error: any) {
    console.error("Error getting Sudents", error);
    res
      .status(500)
      .json({ message: "Error getting Students", error: error.message });
  }
};

// Get the Faculties
export const getFaculty = async (req: Request, res: Response) => {
  try {
    const result = await Faculty.find();
    res.send(result);
  } catch (error: any) {
    console.error("Error getting faculties", error);
    res
      .status(500)
      .json({ message: "Error getting faculties", error: error.message });
  }
};
// Get the Subjects
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const result = await Subject.find();
    res.send(result);
  } catch (error: any) {
    console.error("Error getting Subject", error);
    res
      .status(500)
      .json({ message: "Error getting Subject", error: error.message });
  }
};
