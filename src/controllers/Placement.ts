import { Request, Response } from "express";
import { Placement } from "../schemas/userSchema";

export const uploadQuestions = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("request file ", req.file);

  try {
    const { companyName, conductingDate, totalRounds, roundNames } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Create a new Placement instance
    const newTest = new Placement({
      companyName,
      conductingDate,
      totalRounds,
      roundNames,
      file: req.file.path,
    });
    // Save the new Test to the database
    const savedTest = await newTest.save();

    return res.status(201).json({
      message: "Placement Questions added successfully",
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// Placement Head can view All the Posted Questions
export const getQuestions = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const questions = await Placement.aggregate([
      {
        $addFields: {
          conductingDate: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$conductingDate",
            },
          },
        },
      },
    ]);

    res.send(questions);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};
