import csvParser from 'csv-parser';
import fs from 'fs';
import * as readLine from 'readline';
import dotenv from 'dotenv';
dotenv.config();

const rl = readLine.createInterface({
    input : process.stdin,
    output : process.stdout
})

const fileSource = process.env.FILE_SOURCE;
let filePath: string = '';

export type RowData = {
    id: string;
    question: string;
    answer: string;
};

export type inputChecker = {
    exit: boolean,
    input: string | null
}

let arrayHolder: string[] = [];
let jokeHolder: string = '';
let punchlineHolder: string = '';
let questionsArray: string[][] = [];
let arrayLength: number = 0;
let arrayLengthString: string = '';
let arrayString: string = '';

switch (fileSource) {
    case 'csv':
        filePath = process.env.CSV_FILEPATH!;
        CSVWrite(filePath);
        break;
    case 'json':
        filePath = process.env.JSON_FILEPATH!;
        JSONWrite(filePath);
        break;
}

export function CSVWrite(filePath: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath).pipe(csvParser())
        .on('data', (row: RowData) => {
            questionsArray.push(Object.values(row));
        }).on('end', () => {
            arrayLength = questionsArray.length + 1;
            resolve(questionsArray);
        }).on('error', (err: Error) => {
            reject(err);
        });
    });
}
export function JSONWrite(filePath: string) {
    let jsonObjects: RowData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    questionsArray = jsonObjects.map(person =>  Object.values(person));

    arrayLength = questionsArray.length + 1;
    return questionsArray;
}

export function handleInput(input: string) {
    if (input === '0') {
        const inputChecker = { 
            exit: true, input: null
        }
        return inputChecker;
    }

    const inputChecker = { 
        exit: false, 
        input: input
    }
    return inputChecker;
}

function createJoke() {
    rl.question('\nEnter the joke you would like to add\nEnter 0 to exit:\n', (joke) => {
        const result: inputChecker = handleInput(joke);
        if (result.input) {
            jokeHolder = result.input;
        } else {
            rl.close();
            return;
        }
        return createPunchline();
    })
}

createJoke();

function createPunchline() {
    rl.question('\nEnter joke punchline:\nEnter 0 to exit:\n', (punchline)=> {
        const result: inputChecker = handleInput(punchline);
        if (result.input) {
            punchlineHolder = result.input;
        } else {
            rl.close();
            return;
        }
        return add();
    })
}

function add() {
    rl.question('\nAre you sure you want to add joke (Y/N)? \n', (choice) => {
        choice = choice.toUpperCase();

        if (choice === 'Y') {
            console.log('\nJoke added!');
            arrayLengthString = arrayLength.toString();
            console.log(`${arrayLengthString}. ${jokeHolder} ${punchlineHolder}\n`);
            
            switch (fileSource) {
                case ('csv'):
                    addCSV(arrayLengthString, jokeHolder, punchlineHolder);
                    break;
                case ('json'): 
                    addJSON(arrayLengthString, jokeHolder, punchlineHolder);
                    break;
            }
        return addAnother();
        } else if (choice === 'N') {
            console.log('\nGoing back.');
            return createJoke();
        } else {
            console.log('Not in the choices!');
            return add();
        }
    });
}

export function addCSV(arrayLengthString: string, jokeHolder: string, punchlineHolder: string): string {
    arrayHolder.push(arrayLengthString);
    arrayHolder.push('\"' + jokeHolder + '\"');
    arrayHolder.push('\"' + punchlineHolder + '\"');
    
    // joins to follow the csv format
    arrayString = arrayHolder.join(',');
    fs.appendFileSync(filePath, '\n' + arrayString);

    console.log(arrayString);
    return arrayString;
}

export function addJSON(arrayLengthString: string, jokeHolder: string, punchlineHolder: string): RowData {
    let jsonObjects: RowData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    jsonObjects.push({
        id: arrayLengthString,
        question: jokeHolder,
        answer: punchlineHolder
    })

    fs.writeFile(filePath, JSON.stringify(jsonObjects, null, "\t"), 'utf-8', () =>{});

    return jsonObjects.at(-1)!;
}

function addAnother() {
    rl.question('\nAdd another joke (Y/N)?\n', (choice) => {
        choice = choice.toUpperCase();

        if (choice === 'Y') {
            questionsArray.length = 0;
            arrayLength += 1;
            arrayHolder = [];


            createJoke();
        } else if (choice === 'N') {
            console.log('Goodbye!');
            rl.close();
            return;
        } else { 
            console.log('Not in the choices!');
            return addAnother();
        }
    })
}