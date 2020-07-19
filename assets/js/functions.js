'use strict';

function createForm() {
    const section = document.getElementById('fileSection');
    const form = document.createElement('form');
    form.setAttribute('name', 'fileForm');
    form.classList.add('file-form');
    section.appendChild(form);
    createInputBlock(form);
    createBtnAnalyze(form);
    findFile();
    createResult(section);
}

function createInputBlock(form) {
    let div = document.createElement('div');
    div.classList.add('parent-error', 'input-block');
    form.appendChild(div);
    createLabel(div);
    createInput(div);
    createInputFile(div);
    createError(div);
}

function createLabel(div) {
    const label = document.createElement('label');
    label.setAttribute('for', 'fileText');
    label.classList.add('main-text');
    label.innerText = 'Please choose the file on your computer or write some text';
    div.appendChild(label);
}

function createInput(div) {
    let input = document.createElement('input');
    input.classList.add('input-text');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'fileText');
    input.setAttribute('id', 'fileText');
    div.appendChild(input);
}

function createInputFile(div) {
    const label = document.createElement('label');
    label.setAttribute('for', 'file');
    label.classList.add('input-fileLabel');
    label.innerText = 'Upload file';
    div.appendChild(label);
    let input = document.createElement('input');
    input.classList.add('input-file');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'file');
    input.setAttribute('id', 'file');
    div.appendChild(input);
}

function createError(div) {
    let error = document.createElement('div');
    error.innerText = `No path to the file or no text`;
    error.classList.add('error');
    div.appendChild(error);
}

function createBtnAnalyze(form) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('button-analyzeText');
    button.setAttribute('id', 'analyzeText');
    button.innerText = 'Analyze text';
    form.appendChild(button);
}

function createResult(section) {
    const block = document.createElement('div');
    block.classList.add('modal-result');
    block.setAttribute('id', 'modalResult');
    section.appendChild(block);
    const output = document.createElement('div');
    output.classList.add('modal-result-output');
    const close = document.createElement('div');
    close.classList.add('modal-result-close');
    close.innerText='х';
    close.setAttribute('id', 'close');
    output.appendChild(close);
    block.appendChild(output);
    const content = document.createElement('div');
    content.classList.add('modal-result-content');
    output.appendChild(content);
    const resultTitle = document.createElement('div');
    resultTitle.classList.add('main-text');
    resultTitle.innerText = 'Result';
    content.appendChild(resultTitle);
    createWordsResult(content);
    createLettersResult(content);
    analyzeText();
}

function createWordsResult(content) {
    const outputWords = document.createElement('table');
    outputWords.setAttribute('border', '1');
    outputWords.setAttribute('id', 'resultOutputWords');
    outputWords.classList.add('result-output-words');
    content.appendChild(outputWords);
}

function createLettersResult(content) {
    const outputLetters = document.createElement('table');
    outputLetters.setAttribute('border', '1');
    outputLetters.setAttribute('id', 'resultOutputLetters');
    outputLetters.classList.add('result-output-letters');
    content.appendChild(outputLetters);
}

function createResultContent(txt) {
    let outputWords = document.getElementById('resultOutputWords');
    outputWords.innerHTML = '';
    const outputWordsTitle = document.createElement('caption');
    outputWordsTitle.classList.add('result-output-title');
    outputWordsTitle.innerText = 'TOP 20 Words';
    outputWords.appendChild(outputWordsTitle);
    let outputLetters = document.getElementById('resultOutputLetters');
    outputLetters.innerHTML = '';
    const outputLettersTitle = document.createElement('caption');
    outputLettersTitle.classList.add('result-output-title');
    outputLettersTitle.innerText = 'TOP 10 Letters';
    outputLetters.appendChild(outputLettersTitle);
    calcWordsResult(outputWords, txt);
    calcLettersResult(outputLetters, txt);
    closeModal();
}

function calcWordsResult(outputWords, txt) {
    let words = txt.split('\\');
    let totalOfWords = 0;
    let arrOfUniqueWords = [];
    for(let i = 0; i < words.length; i++){
        let word = words[i].toLowerCase();
        if (arrOfUniqueWords[word]) {
            arrOfUniqueWords[word]++;
        } else {
            arrOfUniqueWords[word] = 1;
        }
        totalOfWords++;
    }
    let arrOfWords = [];
    createObj(arrOfUniqueWords, totalOfWords, arrOfWords);
    showResult(arrOfWords, outputWords, 20);
}

function calcLettersResult(outputLetters, txt) {
    let totalOfLetters = 0;
    let letters = [];
    for (let i = 0; i < txt.length; i++) {
        let letter = txt[i].toLowerCase();
        let W = /\W/;
        if (W.test(letter)) {
            continue;
        } else {
            if (letters[letter]) {
                letters[letter]++;
            } else {
                letters[letter] = 1;
            }
        }
        totalOfLetters++;
    }
    let arrOfLetters = [];
    createObj(letters, totalOfLetters, arrOfLetters);
    showResult(arrOfLetters, outputLetters, 10);
}
function createObj(arrOfUnique, total, arr) {
    for (let key in arrOfUnique) {
        key = {
            name: key,
            entry: arrOfUnique[key],
            frequency: arrOfUnique[key] / total,
        };
        arr.push(key);
        sortByEntry(arr);
    }
}
function sortByEntry(arrOfLetters) {
    arrOfLetters.sort((a, b) => b.entry > a.entry ? 1 : -1);
}

function showResult(arr, output, max) {
    let trTitle = document.createElement('tr');
    for (let key in arr[0]){
        trTitle.innerHTML += '<td>' + key + '</td>';
    }
    output.appendChild(trTitle);
    for(let i = 0; i < arr.length; i++) {
        if (i < max) {
            let tr = document.createElement('tr');
            tr.innerHTML += '<td>' + arr[i]['name'] + '</td><td>' + arr[i]['entry'] + '</td><td>' + arr[i]['frequency'] + '</td>';
            output.appendChild(tr);
        }
    }
}

function findFile() {
    const findBtn = document.getElementById('file');
    findBtn.addEventListener('change', () => {
        let form = document.forms.fileForm;
        let file = form.elements.file.value;
        document.getElementById('fileText').value = file;
    });
}

function analyzeText() {
    const analyzeBtn = document.getElementById('analyzeText');
    analyzeBtn.addEventListener('click', () => {
        let form = document.forms.fileForm;
        let txt = form.elements.fileText.value;
        if(!txt){
            document.querySelector('.error').style.visibility = 'visible';
        } else {
            document.getElementById('modalResult').style.visibility = 'visible';
            document.querySelector('.error').style.visibility = 'hidden';
            createResultContent(txt);
            form.elements.fileText.value = '';
        }
    });
}

function closeModal() {
    const closeBtn = document.getElementById('close');
    closeBtn.addEventListener('click', () => {
        document.getElementById('modalResult').style.visibility = 'hidden';
    });
}