import { useState } from 'react'

import problems from "../Problems.json"



const problemKeys = Object.keys(problems);



const ProblemPanel = (props) => {
  const { currentPath } = props
  if (currentPath.split("/")[currentPath.split("/").length - 1] == "zipped")
  {
    problems.p1.isComplete = true;
  }
    
    return <div style={{ height: "50%", width: "100%", padding: "0 0.2em 0.2em 0.2em" }}>
          <div style={{ height: "100%", width: "100%", backgroundColor: "#1E2D2F", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
            <div>
              {/* Total points and problem*/}
              <div style={{ width: "100%", height: "3em", color: "#F1AB86",display: "flex", justifyContent: "space-between", padding: "1em"} }>
                <b>Points: {`${problems.p1.points}`}</b>
                <b>Problem: {`${problemKeys.indexOf('p1') + 1}`}</b>
              </div>

              {/* Problem number and points */}
              <div style={{width: "100%", height: "3em", color: "#F1AB86", padding: "1em", display: "flex", justifyContent: "center"}}>
                <h1>Problem #{`${problemKeys.indexOf('p1') + 1}`} - {`${problems.p1.points}`} {problems.p1.points === 1 ? "point" : "points"}</h1>
              </div>

              {/* Problem statement */}
              <div style={{color: "#F1AB86", display: "flex", padding: "2em"}}>
                <b>{`${problems.p1.problemText}`}</b>
              </div>
            </div>

            {/* Display if completed */}
            <div style={{color: "#F1AB86", display: "flex", padding: "1em"}}>
              <b>{`${problems.p1.isComplete ? "Completed ✅" : "Not completed ❌"}`}</b>
            </div>
          </div>
    </div>
}

export default ProblemPanel