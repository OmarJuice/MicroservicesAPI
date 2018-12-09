const express = require('express');
const router = express.Router();
const fillers = ['and', 'the', 'to', 'of' ,'is'];

class Dictionary {
    constructor() {
        this.chain = {};
        this.strings = '';
    }
    learn(str) {
        let obj = this.chain;
        for (let word of fillers) {
            obj[word] = [];
        }
        str = str.replace(/[“]+|[”]+|["]+/g, ' ')
        str = str.replace(/\s[\.!:,;?]\s/gm, ', ')
        str = str.replace(/\s*,\s/g, ' ');
        str = str.replace(/undefined/gmi, ' ')
        this.strings = str;
        let strArr = str.split(/\.\s/)
        for (let i = 0; i < strArr.length; i++) {
            strArr[i] = strArr[i].split(/\s/);
        }
        for (let sentence of strArr) {
            for (let i = 0; i < sentence.length; i++) {
                let word = sentence[i];
                let nextWord = sentence[i + 1];

                if (!obj[word] && nextWord !== undefined) {
                    obj[word] = [];
                    obj[word].push(nextWord)
                }
                else if (obj[word] && nextWord !== undefined) {
                    obj[word].push(nextWord)
                }
            }
        }
        for (let key in obj) {
            if (obj[key].length < 2 && !fillers.includes(key)) {
                let random = Math.floor(Math.random() * fillers.length);
                let random2 = Math.floor(Math.random() * fillers.length);
                obj[key].push(fillers[random]);
                obj[key].push(fillers[random2])
                obj[key].filter(e => e);
            }
            
        };
    }
    getsize() {
        return Object.keys(this.chain).length
    }
}

class Poem {
    constructor(dictionary, numLines = 5, wpl = 10) {
        this.dictionary = dictionary;
        this.numLines = numLines;
        this.wpl = wpl; //Words per line
        this.poem = [];
        for (let j = 1; j <= numLines; j++) {
            this.poem.push([]);
        };
    }
    firstWords() {
        for (let i = 0; i < this.numLines; i++) {
            let keys = Object.keys(this.dictionary.chain)

            let randomize = Math.round(keys.length * Math.random())

            this.poem[i].push(keys[randomize]);
        }
    }
    theRest() {
        let chain = this.dictionary.chain;
        for (let j = 0; j < this.numLines; j++)
            for (let k = 0; k <= this.wpl; k++) {
                let line = this.poem[j]; let previousWord = line[k];
                if (chain[previousWord]) {
                    let random = Math.floor(chain[`${previousWord}`].length * Math.random())
                    line.push(chain[previousWord][random])
                }
                else if (!chain[previousWord]) {
                    let newWord = (fillers[Math.floor(Math.random() * 12)]);
                    if (newWord === previousWord) {
                        newWord = (fillers[Math.floor(Math.random() * 12)])
                    }
                }
            }
    }
    create() {
        this.firstWords();
        this.theRest();
        return this.poem.map(line => {
            line = line.join(' ');
            let firstLetter;
            if (line[0]) {
                firstLetter = line[0].toUpperCase();
            }
            line = `${firstLetter}${line.slice(1, line.length)}`
            return `${line}\n`
        })
    }
}

router.get('/poem', function(req, res){
    res.render('poem')
})
router.post('/api/poem', function(req, res){
    if(!req.body.poem){
        return res.status(400).send('Poem parameter: "text" is required')
    }
    if(!req.body.poem.text){
        return res.status(400).send('Text is required')
    }
    if(!req.body.poem.numLines){
        req.body.poem.numLines = 5
    }
    if(!req.body.wpl){
        req.body.wpl = 10
    }
    let dict = new Dictionary();
    dict.learn(req.body.poem.text);
    let poem = new Poem(dict, req.body.poem.numLines, req.body.poem.wpl).create();
    res.json({
        "numUniqueWords": dict.getsize(),
        "poem": poem
    })


})

module.exports = router;