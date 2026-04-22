import { describe, it, expect } from 'vitest';
import { CSVWrite, JSONWrite, handleInput, type inputChecker, type RowData, addCSV, addJSON} from '../write.js'
import dotenv from 'dotenv';
dotenv.config();

const JsonfilePath: string = process.env.JSON_FILEPATH!
const CSVfilePath: string = process.env.CSV_FILEPATH!;

describe('write.JSONWrite', () => {
  it('Gets 1st from the json file', () => {
    const questions: string[][] = JSONWrite(JsonfilePath);

    expect(questions[0]![1]!).toBe('Bakit masama ang salt sa tao?');

    expect(questions[0]![2]!).toBe('Cause its a sin');
  });

  it('Gets 2nd from the json file', () => {
    const questions: string[][] = JSONWrite(JsonfilePath);

    expect(questions[1]![1]!).toBe('Anong pinaka malaking nunal sa buong asia?');

    expect(questions[1]![2]!).toBe('Mole of Asia 🥰');
  });
});

describe('write.CSVWrite', () => {
  it('Gets 3rd from the csv file', async () => {
    const questions = await CSVWrite(CSVfilePath);

    expect(questions[2]![1]!).toBe('Anong anime ang favorite ng mga Muslim?');

    expect(questions[2]![2]!).toBe('Eh di Islam Dunk');
  });

  it('Gets 4th from the csv file', async () => {
    const questions = await CSVWrite(CSVfilePath);
    expect(questions[3]![1]!).toBe('What kind of cat should you never trust?');

      expect(questions[3]![2]!).toBe('A cheetah');
  });
});

describe('read.handleInput', () => {
  it('Exit', () => {
    const result: inputChecker = handleInput('0');
    expect(result).toEqual({
      exit: true,
      input: null
    });
  });

  it('Inputs a joke', () => {
    const result: inputChecker = handleInput('Why did the chicken cross the road?');
    expect(result).toEqual({
      exit: false,
      input: 'Why did the chicken cross the road?'
    });        
  })

  it('Inputs a joke punchline', () => {
    const result: inputChecker = handleInput('To get to the other side!');
    expect(result).toEqual({
      exit: false,
      input: 'To get to the other side!'
    });        
  })
});

describe('write.addJSON', () => {
  it('Checks if joke is added to JSON file', () => {
    const sentence: RowData = addJSON('1', 'Why did the chicken cross the road?', 'To get to the other side!', JsonfilePath);
    expect(sentence).toEqual({
      id: '1',
      question: 'Why did the chicken cross the road?',
      answer: 'To get to the other side!'
    })
  });
});

describe('write.addCSV', () => {
  it('Checks if joke is added to CSV file', () => {
    const sentence: string = addCSV('1', 'Why did the chicken cross the road?', 'To get to the other side!', CSVfilePath);
    expect(sentence).toBe("1,\"Why did the chicken cross the road?\",\"To get to the other side!\"")
  });
});
