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

// const filePath: string = './data/ts-jokes.csv'

type RowData = {
    id: string;
    question: string;
    answer: string;
};


let arrayHolder: string[] = [];
let jokeHolder: string = '';
let punchlineHolder: string = '';
let questionsArray: string[][] = [];
let csvArrayLength: number = 0;
let csvArrayLengthString: string = '';
let arrayString: string = '';


switch (fileSource) {
    case 'csv':
        console.log('csv')
        filePath = process.env.CSV_FILEPATH!;
        csvWrite(questionsArray, filePath);
        break;
    case 'json':
        filePath = process.env.JSON_FILEPATH!;
        jsonWrite(questionsArray, filePath);
        // console.log('json')

        break;
}

function csvWrite(questionsArray: string[][], filePath: string) {
    fs.createReadStream(filePath).pipe(csvParser()).on('data', (row: RowData) => {
        questionsArray.push(Object.values(row));
    }).on('end', () => {
        csvArrayLength = questionsArray.length + 1;
        createJoke();
    });
}
function jsonWrite(questionsArray: string[][], filePath: string) {
    console.log(fs.readFileSync(filePath, 'utf-8'));
    let jsonObjects: RowData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    questionsArray = jsonObjects.map(person =>  Object.values(person));

    csvArrayLength = questionsArray.length + 1;
    createJoke();
}

function createJoke() {
    rl.question('\nEnter the joke you would like to add\nEnter 0 to exit:\n', (joke) => {
        jokeHolder = joke;
        
        if (joke === '0') {
            rl.close();
            return;
        }
        
        return createPunchline();
    })
}

function createPunchline() {
    // punchlineHolder = '';
    rl.question('\nEnter joke punchline:\nEnter 0 to exit:\n', (punchline)=> {
        punchlineHolder = punchline;

        if (punchline === '0') {
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

            
            csvArrayLengthString = csvArrayLength.toString();
            
            console.log(`${csvArrayLengthString}. ${jokeHolder} ${punchlineHolder}\n`);
            arrayHolder.push(csvArrayLengthString);
            arrayHolder.push('\"' + jokeHolder + '\"');
            arrayHolder.push('\"' + punchlineHolder + '\"');
            console.log(arrayHolder);

            arrayString = arrayHolder.join(',');

            // add a switch here. get information indicating json and csv case

            switch (fileSource) {
                case ('csv'):
                    fs.appendFileSync(filePath, '\n' + arrayString);
                    break;
                case ('json'): 
                    let jsonObjects: RowData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                    jsonObjects.push({
                        id: csvArrayLengthString,
                        question: jokeHolder,
                        answer: punchlineHolder
                    })

                    fs.writeFile(filePath, JSON.stringify(jsonObjects, null, "\t"), 'utf-8', (err) => {});
                    console.log(jsonObjects)
                    break;
            }


            return addAnother();
        } else {
            console.log('\nGoing back.');
            return createJoke();
        }
    });
}

function addAnother() {
    rl.question('\nAdd another joke (Y/N)?\n', (choice) => {

        if (choice.toUpperCase() === 'Y') {
            questionsArray.length = 0;
            csvArrayLength += 1;
            arrayHolder = [];


            createJoke();
        } else {
            rl.close();
            return;
        }
    })
}