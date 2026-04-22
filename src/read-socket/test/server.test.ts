import { describe, it, expect } from 'vitest';
import {csvReading, jsonReading, getAnswer, getQuestion, answerChecker, type checker } from '../server.js'
import dotenv from 'dotenv';
dotenv.config();

const questionsArray = [
  ["1", "Bakit masama ang salt sa tao?", "Cause its a sin"],
  ["2", "Anong pinaka malaking nunal sa buong asia?", "Mole of Asia 🥰"],
  ["3", "Anong anime ang favorite ng mga Muslim?", "Eh di Islam Dunk"]
]

const JsonfilePath: string = process.env.JSON_FILEPATH!
const CSVfilePath: string = process.env.CSV_FILEPATH!;

describe('read.getQuestion', () => {
  it('Returns the question corresponding to the said number', () => {
    const question: string = getQuestion(questionsArray, 1);
    expect(question).toBe("Bakit masama ang salt sa tao?");
  });

  it('Returns the question corresponding to the said number', () => {
    const question: string = getQuestion(questionsArray, 2);
    expect(question).toBe("Anong pinaka malaking nunal sa buong asia?");
  });
});

describe('read.getAnswer', () => {
  it('Returns the answer corresponding to the said number',  () => {
    const answer: string = getAnswer(questionsArray, 1);
    expect(answer).toBe("Cause its a sin");
  });

  it('Returns the answer corresponding to the said number',  () => {
    expect(getAnswer(questionsArray, 2)).toBe("Mole of Asia 🥰");
  });
})

describe('read.answerChecker', () => {
  it('Invalid: not a number', () => {
    const input: checker = answerChecker(questionsArray, 'abc');
    expect(input).toEqual({
      type: "error",
      message: "Not a number!"
    });
  });

  it('Invalid: Not a whole number', () => {
    const input: checker = answerChecker(questionsArray, '3.14');
    expect(input).toEqual({
      type: "error",
      message: "Whole numbers only."
    });
  });

  it('Invalid: beyond the choices', () => {
    const input: checker = answerChecker(questionsArray, '4');
    expect(input).toEqual({
      type: "error",
      message: "Not within the choices. Choose again!"
    });
  });

  it('Exit', () => {
    const input: checker = answerChecker(questionsArray, '0');
    expect(input).toEqual({
      type: "exit",
      message: "Goodbye!"
    });
  });
})

describe('read.jsonReading', () => {
  it('Gets 1st from the json file', () => {
    const questions: string[][] = jsonReading(JsonfilePath);

    expect(questions[0]![1]!).toBe('Bakit masama ang salt sa tao?');

    expect(questions[0]![2]!).toBe('Cause its a sin');
  });

  it('Gets 2nd from the json file', () => {
    const questions: string[][] = jsonReading(JsonfilePath);

    expect(questions[1]![1]!).toBe('Anong pinaka malaking nunal sa buong asia?');

    expect(questions[1]![2]!).toBe('Mole of Asia 🥰');
  });
});

describe('read.csvReading', () => {
  it('Gets 3rd from the csv file', async () => {
    const questions = await csvReading(CSVfilePath);

    expect(questions[2]![1]!).toBe('Anong anime ang favorite ng mga Muslim?');

    expect(questions[2]![2]!).toBe('Eh di Islam Dunk');
  });

  it('Gets 4th from the csv file', async () => {
    const questions = await csvReading(CSVfilePath);
    expect(questions[3]![1]!).toBe('What kind of cat should you never trust?');

    expect(questions[3]![2]!).toBe('A cheetah');
  });
});