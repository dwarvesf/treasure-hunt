import React, { useState } from "react";
import { Stepper } from "../components/Stepper";
import { CharacterAnimation } from "./CharacterAnimation";

export const Menu = (props: any) => {
  const [value, setValue] = useState("");

  return (
    <div
      onClick={(e) => {
        if (props.isRunning) {
          e.stopPropagation();
          props.setRunning(false);
        }
      }}
      className="flex flex-col md:h-full w-72 shadow md:shadow-none bg-white md:right-0 right-6 bottom-0 rounded-t-lg md:rounded-none absolute md:static md:w-96 border md:border-l md:border-t-0 md:border-r-0 md:border-b-0 border-slate-300"
    >
      <div className="p-3 flex flex-col">
        <div className="mb-3 md:hidden mx-auto rounded-xl h-0.5 w-10 bg-gray-300" />
        <p className="text-brand border-b border-b-brand mx-auto text-sm">
          Question
        </p>
        <label className="font-medium mt-2 text-center text-xl md:text-2xl">
          &ldquo;This is the question that you need to answer&rdquo;
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props?.onSubmit(value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col mx-auto mt-4"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            id="answer"
            className="py-1 shadow-sm rounded-md border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            className="bg-brand rounded px-2 py-1 text-white mx-auto mt-2 text-sm"
            type="submit"
          >
            Submit answer
          </button>
        </form>
      </div>
      <div className="w-full h-px bg-slate-300" />
      <div className="py-4 px-5 flex flex-col bg-gray-50 flex-1">
        <Stepper.Container current={1} loading={false}>
          <Stepper.Step num={1} title="Destination 1">
            Q: Question
            <br />
            A: Answer
          </Stepper.Step>
          <Stepper.Step num={2} title="Destination 2">
            Q: Question
            <br />
            A: Answer
          </Stepper.Step>
          <Stepper.Step num={3} title="Destination 3">
            Q: Question
            <br />
            A: Answer
          </Stepper.Step>
          <Stepper.Step num={4} title="Destination 4">
            Q: Question
            <br />
            A: Answer
          </Stepper.Step>
        </Stepper.Container>
      </div>
      <div className="bg-gray-50">
        <CharacterAnimation isRunning={props.isRunning} />
      </div>
    </div>
  );
};
