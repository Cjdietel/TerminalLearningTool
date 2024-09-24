import { useState } from 'react'


const Shell = (props) =>
{
    return <div className="shellDiv" style={{ width: "70%", height: "100%"}}>
                <div className='shellCommands' style={{padding:"2em"}}>
                    <p style={{color:"#F7DBA7"}}>Starting Shell Learning Session... <br></br>[ user@ShellLearning ~] $</p>
                </div>
            </div>
}

export default Shell