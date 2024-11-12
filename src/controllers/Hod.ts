import { Request, Response } from "express";
import { Assignment, Course, Mark, Student } from "../schemas/userSchema";
import moment from "moment";
// Hod can Add the Courses Successsfully
export const coursesAdd = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      semester,
      subject,
      category,
      facultyId,
      facultyName,
      questions,
      date,
      deadline,
      link,
    } = req.body;

    // Create the course data object
    const courseData: any = {
      semester,
      subject,
      category,
      facultyId,
      facultyName,
      questions,
      date,
      deadline,
      link,
    };

    // Check if the file is uploaded and add it to courseData if present
    if (req.file) {
      courseData.file = req.file.path;
    }

    // Create a new Course instance with the filtered data
    const newCourse = new Course(courseData);

    // Save the new Course to the database
    const savedCourse = await newCourse.save();
    res.send(savedCourse);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Export const Get All courses
export const getCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    const semester = req.params.semester;
    const subject = decodeURIComponent(req.params.subject);

    const courses = await Course.aggregate([
      {
        $match: {
          semester: semester,
          subject: subject,
        },
      },
      {
        $addFields: {
          conductingDate: {
            $dateToString: {
              format: "%d-%m-%Y", // Correct format for day-month-year
              date: "$conductingDate",
            },
          },
        },
      },
    ]);

    res.send(courses);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Getting Student byThe Semester
export const getStudentBySemester = async (
  req: Request,
  res: Response
): Promise<any> => {
  const semester = req.params.semester;
  try {
    const result = await Student.find({ semester: semester });
    res.send(result);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Assigning Marks
export const assignMarks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      examType,
      totalMarks,
      obtainedMarks,
      rollNumber,
      semester,
      subject,
    } = req.body;

    // Create the marks
    const marks: any = {
      examType,
      totalMarks,
      obtainedMarks,
      rollNumber,
      semester,
      subject,
    };

    // Create a new Marks instance with the filtered data
    const newMarks = new Mark(marks);

    // Save the new Marks to the database
    const savedMarks = await newMarks.save();
    res.send(savedMarks);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

export const getMarks = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await Mark.find();
    res.send(result);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

export const getAnswers = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await Assignment.find();
    res.send(result);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

export const getAssignments = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await Course.find();

    // Format the date field in each assignment
    const formattedResult = result.map((assignment: any) => {
      // Assuming the date field is named 'date' in each assignment
      return {
        ...assignment.toObject(), // Convert mongoose document to plain object
        date: moment(assignment.date).format("DD-MM-YYYY"), // Format date
      };
    });

    res.send(formattedResult);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

export const getStudentAsignments = async (
  req: Request,
  res: Response
): Promise<any> => {
  const id = req.params.id;
  try {
    const result = await Assignment.find({ assignmentId: id })
      .populate("rollNumber")
      .select("");
    console.log(result);
    res.send(result);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

export const updateStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { assignmentId, studentId, isChecked } = req.body;
    const result = await Assignment.updateOne(
      { assignmentId: assignmentId, rollNumber: studentId },
      { $set: { checked: isChecked } }
    );
    console.log(result);
    res.send({ msg: "Updated Successfully", result });
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};
