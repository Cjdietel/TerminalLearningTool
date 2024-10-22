import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';



const ZipLoader = () => {

    // let [fs,setFs] = useState({})
    let fs = {}

    JSZipUtils.getBinaryContent('../../zipped.zip', function(err, data) { // JSZip website
        if(err) {
            throw err; 
        }
        JSZip.loadAsync(data).then(function (data) {
            // console.log(data)
            // for (let i = 0; i < data.length; i++) {
            //     console.log(data[i])
            // } 
            data.forEach(function(path, entry){
                // console.log(path)
                // console.log(entry.dir)
                let filePathArray 
                if (entry.name.endsWith('/')) {
                    filePathArray = entry.name.slice(0, -1).split('/');
                  } else {
                    filePathArray = entry.name.split('/');
                  }
                let currentLevel = fs // start at root
                for (let i = 0; i < filePathArray.length; i++) {
                    const pathPart = filePathArray[i]
                    if (i === filePathArray.length - 1) {
                        currentLevel[pathPart] = null
                    }
                    else {
                        if (!currentLevel[pathPart]) {
                            currentLevel[pathPart] = {};
                        }
                        currentLevel = currentLevel[pathPart]
                    }
                    // fs = {...fs, [`${filePathArray[i]}`] : { }}
                }
            }) 
            console.log(fs)
        });
    });

    return (
        <div>
        </div>
    );
};

export default ZipLoader;