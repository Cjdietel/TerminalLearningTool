import { useState } from 'react'


const Shell = (props) =>
{
    return <div className="shellDiv">
                <div className='shellCommands' style={{padding:"2em"}}>
                    <div style={{color:"#F7DBA7"}}>
                        <div>Starting Shell Learning Session...</div>
                        <div style={{ display: 'flex'}}>
                            <p>[ user@ShellLearning ~] $</p>
                            <input type='text'></input>
                        </div>
                    </div>
                </div>
            </div>
}

export default Shell