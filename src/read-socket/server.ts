import csvParser from 'csv-parser';
import fs from 'fs';
import * as readline from 'readline';
import dotenv from 'dotenv';
import * as net from 'net';
dotenv.config();

const fileSource: string = process.env.FILE_SOURCE!;
const environment: string = process.env.ENVIRONMENT!;
const PORT: string = process.env.PORT!;
let filePath: string = '';
let questionsArray: string[][] = [];

const rl = readline.createInterface({
  input : process.stdin,
  output : process.stdout
});

type RowData = {
    id: string;
    question: string;
    answer: string;
};

// switch for filepath based on filesource
switch (fileSource) {
  case 'csv':
    filePath = process.env.CSV_FILEPATH!;
    csvReading(filePath);
    break;
  case 'json':
    filePath = process.env.JSON_FILEPATH!;
    jsonReading(filePath)
    break;
}

// CSV file parsing
export function csvReading(filePath: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: RowData) => {
        questionsArray.push(Object.values(row));
      }).on('end', () => {
        resolve(questionsArray);
      }).on('error', reject);
  });
}

// JSON file parsing
export function jsonReading(filePath: string): string[][] {
  let jsonObjects: RowData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  questionsArray = jsonObjects.map(person =>  Object.values(person));

  return questionsArray;
}

// starts the server
function server() {
  const server = net.createServer((conn) => {
    console.log('Server: New client.')

    // asks the question to the client
    function askQuestion(questionsArray: string[][]) {
      conn.write(`\nChoose a number for a joke (1-${questionsArray.length}).\nEnter 0 to exit:\n`);
    }  

    // on data (reads the user inputs), does the following
    conn.on('data', (data) => {
      let userInput: string = data.toString().trim();
      const choice = answerChecker(questionsArray, userInput);
      const input: number = Number(userInput);

      //checker
    if (choice.type === 'error') {
      conn.write(choice.message);
      return askQuestion(questionsArray);
    }

    // checker
    if (choice.type === 'exit') {
      console.log('Server: Client ended connection.');
      conn.write(choice.message, () => {
      conn.destroy();
      });
      return;
    }

    const question: string = getQuestion(questionsArray, input);
    const answer: string = getAnswer(questionsArray, input);

    // shows the joke to the user
    conn.write('\n' + question + " ");
    conn.write(answer);
  
    // loops
    askQuestion(questionsArray);
  });

    conn.on('error', (err) => {
      console.log('error:', err.message);
    });

    // calls the function
    askQuestion(questionsArray);
  });

  server.listen(PORT, () => {
    console.log(`Server: Listening on port ${PORT}.`);
  });
}

// Question based on the questionNumber
export function getQuestion(questionsArray: string[][], questionNumber: number): string {
  const question: string = questionsArray[questionNumber - 1]![1]!;
  return question;
}

// Answer based on the answerQuestion
export function getAnswer(questionsArray: string[][], answerQuestion: number): string {
  const answer: string = questionsArray[answerQuestion - 1]![2]!;
  return answer;
}

export type checker = {
  type: string,
  message: string
}

// answer is checked if its type is correct
export function answerChecker(questionsArray: string[][], userInput: string): checker {
  const choice: number = Number(userInput);

  if (isNaN(choice)) {
    const checker = {
      type: "error",
      message: "Not a number!"
    }
    return checker;
  }

  if (choice % 1 !== 0) {
    const checker = {
      type: "error",
      message: "Whole numbers only."
    }
    return checker;
  }

  if (choice > questionsArray.length || choice < 0) {
    const checker = {
      type: "error",
      message: "Not within the choices. Choose again!"
    }
    return checker;
  }

  if (choice === 0) {
    const checker = {
      type: "exit",
      message: "Goodbye!"
    }
    return checker;
  }

  const checker = {
    type: "success",
    message: ""
  }
  return checker;
}