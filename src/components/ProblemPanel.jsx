import { useState } from 'react'

import problems from "../Problems.json"

const ProblemPanel = (props) => {
    return <div style={{ height: "50%", width: "100%", padding: "0 0.2em 0.2em 0.2em" }}>
          <div style={{ height: "100%", width: "100%", backgroundColor: "#C57B57" }}>
            <div>{`${problems.p1.problemText}`}</div>
            <div>{`${problems.p1.isComplete ? "Has been completed" : "Has not been completed"}`}</div>
          </div>
    </div>
}

export default ProblemPanel