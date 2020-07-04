'use strict';

function createForm() {
    const section = document.getElementById('fileSection');
    const form = document.createElement('form');
    form.setAttribute('name', 'fileForm');
    section.appendChild(form);
    createInputBlock(form);
    createBtnFind(form);
    createResult(section);
}

function createInputBlock(form) {
    const label = document.createElement('label');
    label.setAttribute('for', 'fileLabel');
    label.innerText = 'Please write path to the file or its name..';
    form.appendChild(label);
    let div = document.createElement('div');
    div.classList.add('parent-error', 'input-block');
    form.appendChild(div);
    createInput(div);
    createError(div);
}

function createInput(div) {
    let input = document.createElement('input');
    input.classList.add('input-text');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'file');
    input.setAttribute('id', 'fileText');
    div.appendChild(input);
}

function createError(div) {
    let error = document.createElement('div');
    error.innerText = `Incorrect path or name of the file`;
    error.classList.add('error');
    div.appendChild(error);
}

function createBtnFind(form) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('button-findFile');
    button.setAttribute('id', 'findFile');
    button.innerText = 'Find file';
    form.appendChild(button);
}

function createResult(section) {
    const block = document.createElement('div');
    block.classList.add('result');
    section.appendChild(block);
    const output = document.createElement('div');
    output.classList.add('result-output');
    createWordsResult(output);
    createLettersResult(output);
    block.appendChild(output);
    findFile();
}

function createWordsResult(output) {
    const outputWords = document.createElement('div');
    outputWords.setAttribute('id', 'resultOutputWords');
    outputWords.classList.add('result-output-words');
    output.appendChild(outputWords);
}

function createLettersResult(output) {
    const outputLetters = document.createElement('div');
    outputLetters.setAttribute('id', 'resultOutputLetters');
    outputLetters.classList.add('result-output-letters');
    output.appendChild(outputLetters);
}

function calcWordsResult(outputWords, txt) {
    let words = txt.split('/');
    let totalOfWords = 0;
    let arrOfUniqueWords = [];
    for(let i = 0; i < words.length; i++){
        if (words[i] >= 'a' && words[i] <= 'z') {
            if (arrOfUniqueWords[words[i]] !== undefined) {
                arrOfUniqueWords[words[i]]++;
            } else {
                arrOfUniqueWords[words[i]] = 1;
            }
            totalOfWords++;
        } else {
            document.querySelector('.error').style.display = 'block';
        }
    }
    let arrOfWords = [];
    for (let key in arrOfUniqueWords) {
        key = {
            name: key,
            entry: arrOfUniqueWords[key],
            freq: arrOfUniqueWords[key] / totalOfWords,
            toString: function() {
                return 'Word ' + this.name + ': entry - ' + this.entry + ' , frequency of entry - ' + this.freq;
            }
        };
        arrOfWords.push(key);
        sortByEntry(arrOfWords);
    }
    showResult(arrOfWords, outputWords, 20);
}

function calcLettersResult(outputLetters, txt) {
    let total = 0;
    let letters = [];
    for (let i = 0; i < txt.length; i++) {
        let letter = txt[i].toLowerCase();
        if (letter >= 'a' && letter <= 'z') {
            if (letters[letter]) {
                letters[letter]++;
            } else {
                letters[letter] = 1;
            }
        } else {
            document.querySelector('.error').style.display = 'block';
        }
        total++;
    }

    let arrOfLetters = [];
    for (let key in letters) {
        key = {
            name: key,
            entry: letters[key],
            freq: letters[key] / total,
            toString: function() {
                return 'Letter ' + this.name + ': entry - ' + this.entry + ' , frequency of entry - ' + this.freq;
            }
        };
        arrOfLetters.push(key);
        sortByEntry(arrOfLetters);
    }
    showResult(arrOfLetters, outputLetters, 10);
}

function sortByEntry(arrOfLetters) {
    arrOfLetters.sort((a, b) => b.entry > a.entry ? 1 : -1);
}

function showResult(arr, output, max) {
    for(let i = 0; i < arr.length; i++) {
        if (i < max) {
            output.innerHTML += arr[i] + '<br/>';
        }
    }
}

function findFile() {
    const findBtn = document.getElementById('findFile');
    findBtn.addEventListener('click', () => {
        const form = document.forms.fileForm;
        let txt = form.elements.file.value;
        let d = /[0-9]/;
        let s = /\s/;
        if(!txt || d.test(txt) || s.test(txt)){
            document.querySelector('.error').style.visibility = 'visible';
        } else {
            document.querySelector('.error').style.visibility = 'hidden';
            let outputWords = document.getElementById('resultOutputWords');
            outputWords.innerHTML = '';
            const outputWordsTitle = document.createElement('div');
            outputWordsTitle.classList.add('result-output-title');
            outputWordsTitle.innerText = 'TOP 20 Words';
            outputWords.appendChild(outputWordsTitle);
            let outputLetters = document.getElementById('resultOutputLetters');
            outputLetters.innerHTML = '';
            const outputLettersTitle = document.createElement('div');
            outputLettersTitle.classList.add('result-output-title');
            outputLettersTitle.innerText = 'TOP 10 Letters';
            outputLetters.appendChild(outputLettersTitle);
            calcWordsResult(outputWords, txt);
            calcLettersResult(outputLetters, txt);
            form.elements.file.value = '';
        }
    });
}