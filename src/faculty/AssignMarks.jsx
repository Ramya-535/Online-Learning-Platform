import React, { useEffect, useState } from "react";
import subjects from "../hod/subjects"; // Assuming you have an array of subjects in this file
import subjects1 from "../subjects1";
import AllStudentMarks from "../hod/AllStudentMarks";
import AxiosApi from "../AxiosAPI";
import { toast } from "react-toastify";

function AssignMarks() {
  const [numSubjects, setNumSubjects] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [rollNumber, setRollNumber] = useState(""); // State to store roll number

  const handleSelectChange1 = (index, event) => {
    const newSelectedSubjects = [...selectedSubjects];
    newSelectedSubjects[index] = event.target.value;
    setSelectedSubjects(newSelectedSubjects);
  };

  const handleInputChange = (index, event) => {
    const newSubjectData = [...subjectData];
    newSubjectData[index] = event.target.value;
    setSubjectData(newSubjectData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Combine roll number and subject marks into an object
    const dataToSend = {
      rollNumber: rollNumber,
    };

    selectedSubjects.forEach((subject, index) => {
      dataToSend[subject] = subjectData[index] || ""; // Add subject marks
    });

    // Send dataToSend to the backend here
    console.log(dataToSend);
  };

  const renderSubjectInputs = () => {
    const subjectInputs = [];
    for (let i = 0; i < numSubjects; i++) {
      subjectInputs.push(
        <div key={i} className="row">
          <div className="col-4">
            <select
              name={`subject-${i}`}
              className="form-select mt-3"
              value={selectedSubjects[i] || ""}
              onChange={(event) => handleSelectChange(i, event)}
            >
              <option value="">Select a subject</option>
              {subjects.map((item, index) => (
                <option key={index} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <input
              type="text"
              value={subjectData[i] || ""}
              onChange={(event) => handleInputChange(i, event)}
              className="form-control mt-3"
            />
          </div>
        </div>
      );
    }
    return subjectInputs;
  };
  const [selectedOptions, setSelectedOptions] = useState();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [totalMarks, setTotalMarks] = useState("5");
  const [obtainedMarks, setObtainedMarks] = useState();
  const [details, setDetails] = useState();
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected.target.value);
    setSubject("");
    setCategory("");
    setYear("");
  };
  const getStudentbySemester = async () => {
    try {
      const response = await AxiosApi.get(`student/get/semester/${year}`);
      console.log("Students:", response.data);
      setDetails(response.data);
    } catch (error) {
      console.log("getSemError:", error);
    }
  };
  useEffect(() => {
    getStudentbySemester();
  }, [year]);
  const [marksWithId, setMarksWithID]=useState([{
    total:'', 
    obtain:'',
    id:''
  }])
  const handleMarksChange=(total, id)=>{
setMarksWithID({
  ...marksWithId, total:total, id: id
})
  }
  const handleObtainMarksChange=(total, id)=>{
    setMarksWithID({
      ...marksWithId, total:total, id: id
    })
      }
  const submitMarks = async (rollNumber) => {
    console.log(rollNumber)
    console.log(marksWithId,"total");
    console.log(obtainedMarks,"obtained")
    if (obtainedMarks <= totalMarks) {
      try {
        const result = await AxiosApi.post(`marks`, {
          semester: year,
          examType: category,
          subject: subject,
          rollNumber: rollNumber,
          totalMarks: totalMarks,
          obtainedMarks: obtainedMarks,
        });
        console.log("marks sent:", result);
        toast.success(result?.data.msg);
      } catch (error) {
        console.log("submit marks error:", error);
      }
    }
    //  else alert("Total Marks should be greater than obtained marks");
  };
  return (
    <div>
      <div className="container">
        <div className="row">
          <h4>Marks</h4>
          <div className="col-lg-3 mt-1 ">
            <label className="form-label">Select Semester</label>
            <select
              name=""
              className="form-control"
              required
              onChange={handleSelectChange}
            >
              <option value="">Select </option>
              <option value="odd">Odd</option>
              <option value="even">Even</option>
            </select>
          </div>
          {selectedOptions === "odd" && (
            <div className="col-lg-3 mt-1 ">
              <label className="form-label">Odd Semester</label>
              <select
                name=""
                className="form-control"
                required
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Select </option>
                <option value="I-I">I-I</option>
                <option value="II-I">II-I</option>
                <option value="III-I">III-I</option>
                <option value="IV-I">IV-I</option>
              </select>
            </div>
          )}
          {selectedOptions === "even" && (
            <div className="col-lg-3 mt-1 ">
              <label className="form-label">Even Semester</label>
              <select
                name=""
                className="form-control"
                required
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Select </option>
                <option value="I-II">I-II</option>
                <option value="II-II">II-II</option>
                <option value="III-II">III-II</option>
                <option value="IV-II">IV-II</option>
              </select>
            </div>
          )}
          {year && (
            <div className="col-lg-3 mt-1">
              <label htmlFor="" className="form-label">
                Subject
              </label>
              <select
                name=""
                className="form-select"
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select</option>
                {subjects1.map(
                  (item) =>
                    item.year === year && (
                      <option value={item.name} key={item.name}>
                        {item.name}
                      </option>
                    )
                )}
              </select>
            </div>
          )}

          {subject && (
            <div className="col-lg-3 mt-1 ">
              <label className="form-label">Exam Type</label>
              <select
                name=""
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Mid-Sem-I">Mid-I</option>
                <option value="Mid-Sem-II">Mid-II</option>
                <option value="Assignment-I">Assignment-I</option>
                <option value="Assignment-II">Assignment-II</option>
              </select>
            </div>
          )}
          {category && (
            <table className=" table table-hover  table-primary  table-responsive table-bordered mt-3">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Semester</th>
                  <th>Subject</th>
                  <th>Exam </th>
                  <th>Total Marks</th>
                  <th>Obtained Marks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {details ? (
                  details.map((item) => (
                    <tr key={item._id}>
                      <td>{item.studentName}</td>
                      <td>{item._id}</td>
                      <td>{year}</td>
                      <td>{subject}</td>
                      <td>{category}</td>
                      <td>
                      <input
                          type="text"
                          placeholder="enter marks"
                          onChange={(e) => handleMarksChange(e.target.value, item._id)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="enter marks"
                          onChange={(e) => handleObtainMarksChange(e.target.value , item._id)}
                        />
                      </td>
                      <td>
                        <button onClick={() => submitMarks(item._id)}>
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>In this semester no students registered</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {/* {category && (
            <div className="col-lg-6 mt-1 ">
              <label className="form-label">Roll Number</label>
              <select
                name=""
                className="form-control"
                required
                onChange={(e) => setRollNumber(e.target.value)}
              >
                <option value="" >
                  Select
                </option>
                <option value="24A2CCAA3191">24A2CCAA3191</option>
                <option value="24A2CCAA3192">24A2CCAA3192</option>
              </select>
            </div>
          )}
          {rollNumber && (
            <div className="col-lg-6 mt-1 ">
              <label className="form-label">Total Marks</label>
              <input type="text" className="form-control" />
            </div>
          )}
            {rollNumber && (
            <div className="col-lg-6 mt-1 ">
              <label className="form-label">Obtained Marks</label>
              <input type="text" className="form-control" />
            </div>
          )}
          {rollNumber && (
            <div className="col-lg-12 mt-1 ">
              <button
                type="submit"
                className="btn btn-outline-success btn-lg  mt-3"
              >
                Submit
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default AssignMarks;
{
  /* <div className="container">
        <div className="row">
          <div className="col-8">
            <div className="card">
              <div className="card-body">
                <h1>Upload Marks</h1>
                <form onSubmit={handleSubmit}>
            
            <label className="form-label">Exam Type</label>
            <select name="" className="form-control">
                <option value="" disabled>Select</option>
                <option value="">Mid-Sem-I</option>
                <option value="">Mid-Sem-II</option>
            </select>
       
                  <label className="form-label">Student Roll Number:</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(event) => setRollNumber(event.target.value)}
                    className="form-control"
                  />
                  <label className="form-label">Number of Subjects:</label>
                  <input
                    type="number"
                    value={numSubjects}
                    onChange={(event) => setNumSubjects(event.target.value)}
                    className="form-control"
                    
                  />
               
                  {numSubjects > 0 && renderSubjectInputs()}
                  <button type="submit" className="btn btn-outline-success mt-3">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div> */
}
