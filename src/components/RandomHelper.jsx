import config from './config.json';
/*
        
   Inspired heavily by the random_helper.py system established by ___ in the original shell-adventure

*/

const RandomHelper = () => {

    const names = (config.nameDictionary).split('\n').trim()
    names.filter(n => n)
    const min = 1;
    const max = names.length - 1;
    

    const name = () => {

        const i = Math.floor(Math.random() * names.length)
        const nameChoice = names[i]
        return nameChoice
    }

    const paragraphs = () => {
        let paragraph = [];
        const paragraphLength = Math.floor(Math.random())
        let wordChoice = Math.floor(Math.random() * (max - min) + min)
        for (const i = 0; i <= paragraphLength, i++;) {
            paragraph.push(names[wordChoice]);
        }
    }

    const file = () => {

    }

    const folder = () => {
        
    }

    const markedShared = () => {

    }

}
