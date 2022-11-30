import React, { useState } from "react";
import { Stepper } from "../components/Stepper";
import { CharacterAnimation } from "./CharacterAnimation";

export const Menu = (props: any) => {
  const [value, setValue] = useState("");

  const clue = props.clue;
  return (
    <div
      onClick={(e) => {
        if (props.isRunning) {
          e.stopPropagation();
          props.setRunning(false);
        }
      }}
      className="max-h-screen min-h-full flex flex-col w-80 md:w-96 shadow md:shadow-none bg-white rounded-t-lg md:rounded-none border md:border-l md:border-t-0 md:border-r-0 md:border-b-0 border-slate-300"
    >
      <div className="p-3 flex flex-col flex-shrink-0">
        <div className="mb-3 md:hidden mx-auto rounded-xl h-0.5 w-10 bg-gray-300" />
        <p className="text-brand border-b border-b-brand mx-auto text-sm">
          Question
        </p>
        <label className="font-medium mt-2 text-center text-xl md:text-2xl">
          {clue?.status !== "completed" ? (
            props.isWithinRange && props.currentQuestion ? (
              <>&ldquo;{props.currentQuestion}&rdquo;</>
            ) : (
              "Go to the location to reveal question"
            )
          ) : (
            "You've answered all questions"
          )}
        </label>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.getElementsByTagName("input")[0];
            if (clue?.clue?.id) {
              input.disabled = true;
              const correctAnswer = await props?.onSubmit(clue.clue.id, value);
              input.disabled = false;
              if (correctAnswer) {
                setValue("");
                input.classList.remove("input-error");
                input.classList.add("input-normal");
              } else {
                input.select();
                input.classList.remove("input-normal");
                input.classList.add("input-error");
                input?.classList.toggle("animate-wiggle");
                setTimeout(() => {
                  input?.classList.toggle("animate-wiggle");
                }, 500);
              }
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col w-2/3 mx-auto mt-4"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            id="answer"
            className="input-normal w-full py-1 shadow-sm rounded-md border-gray-300 focus:ring-opacity-50"
          />
          <div className="flex flex-col md:flex-row space-3">
            <button
              className="bg-brand rounded px-2 py-1 text-white mx-auto mt-2 text-sm"
              type="submit"
            >
              Submit answer
            </button>
            <button
              onClick={props?.recenter}
              className="hover:underline px-2 py-1 text-foreground mx-auto mt-2 text-sm"
              type="button"
            >
              Where am I?
            </button>
          </div>
        </form>
      </div>
      <div className="w-full h-px bg-slate-300 flex-shrink-0" />
      <div className="py-4 px-5 flex flex-col bg-gray-50 flex-1 overflow-auto min-h-full">
        {clue ? (
          <Stepper.Container
            current={Math.min(4, clue.finished?.length ?? 0) + 1}
            loading={false}
          >
            {Array(4)
              .fill(0)
              .map((_, i) => {
                const isCurrentQuestion = (clue.finished?.length ?? 0) === i;
                return (
                  <Stepper.Step
                    key={`clue-${i}`}
                    num={i + 1}
                    title={
                      isCurrentQuestion ? (
                        <span
                          onClick={props.goToDestination}
                          className="text-brand underline cursor-pointer"
                        >
                          {clue.clue?.location_name}
                        </span>
                      ) : (
                        clue.finished?.[i]?.location_name ?? "Unknown location"
                      )
                    }
                  >
                    {isCurrentQuestion
                      ? !props.isWithinRange || !props.currentQuestion
                        ? "Go to this location to unlock the question"
                        : `Q: ${props.currentQuestion}`
                      : `Q: ${clue.finished?.[i]?.question ?? "????"}`}
                    <br />
                    {isCurrentQuestion
                      ? null
                      : `A: ${clue.finished?.[i]?.answer ?? "????"}`}
                  </Stepper.Step>
                );
              })}
            <Stepper.Step
              num={5}
              title={clue.status === "completed" ? "Congrats" : "????"}
            >
              {clue.status === "completed"
                ? "You have completed this challenge, your team can return to the hotel"
                : null}
            </Stepper.Step>
          </Stepper.Container>
        ) : null}
      </div>
      <div className="bg-gray-50">
        <CharacterAnimation isRunning={props.isRunning} />
      </div>
    </div>
  );
};
