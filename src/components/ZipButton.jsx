import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';



const ZipButton = () => {

    // let [fs,setFs] = useState({})
    let fs = {}

    JSZipUtils.getBinaryContent('../../zipped.zip', function(err, data) { // JSZip website
        if(err) {
            throw err; // or handle err
        }
        JSZip.loadAsync(data).then(function (data) {
            // console.log(data)
            // for (let i = 0; i < data.length; i++) {
            //     console.log(data[i])
            // } 
            data.forEach(function(path, entry){
                // console.log(entry.name)
                // console.log(entry.dir)
                let filePathArray = entry.name.split('/')
                for (let i = 0; i < filePathArray.length; i++) {
                    // setFs(...filePathArray[i])
                    // console.log(filePathArray[i])
                    fs = {...fs, [`${filePathArray[i]}`] : { }}
                }

                console.log(fs)

            }) 
            // console.log(fs)
        });
    });



        // new JSZip.external.Promise(function (resolve, reject) {
        //     JSZipUtils.getBinaryContent('path/to/content.zip', function(err, data) {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             resolve(data);
        //         }
        //     });
        // }).then(function (data) {
        //     return JSZip.loadAsync(data);
        // })
        // .then(
        //     alert(data)
        // )

    return (
        <div>
            {/* <input type='file' id='file' ref={inputFile}></input> */}
            {/* <button onClick={handleClick}>Open File</button> */}
        </div>
    );
};

export default ZipButton;