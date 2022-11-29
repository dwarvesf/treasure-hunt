import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Spinner } from "./Spinner";
import cln from "classnames";

type StepProps = {
  num: number;
  title: React.ReactNode;
  children: React.ReactNode;
  _current?: number;
  _loading?: boolean;
  _last?: boolean;
};

const Step = (props: StepProps) => {
  const current = props._current ?? 0;
  const loading = props._loading ?? false;
  const last = props._last ?? false;

  return (
    <div className="flex gap-x-3">
      <div className="relative">
        {!last && (
          <div
            className={cln(
              "absolute top-0 left-1/2 mt-0.5 rounded -translate-x-1/2 h-full w-0.5",
              {
                "bg-brand": props.num < current,
                "bg-gray-200": props.num >= current,
              }
            )}
          />
        )}
        <div
          className={cln(
            "relative mt-0.5 text-white w-5 h-5 rounded-full flex justify-center items-center text-xs self-start",
            {
              "bg-brand": props.num <= current,
              "bg-gray-200": props.num > current,
            }
          )}
        >
          {loading && props.num === current ? (
            <Spinner className="w-3 h-3" />
          ) : props.num < current ? (
            <CheckIcon className="w-3 h-3" />
          ) : (
            props.num
          )}
        </div>
      </div>
      <div
        className={cln("flex flex-col pb-5", {
          "text-gray-300": props.num > current,
          "text-foreground": props.num <= current,
        })}
      >
        <p className="font-medium text-base">{props.title}</p>
        <p className="text-sm">{props.children}</p>
      </div>
    </div>
  );
};

type StepperContainerProps = {
  current: number;
  loading: boolean;
  children: React.ReactNode;
};

const StepperContainer = (props: StepperContainerProps) => {
  return (
    <div className="flex flex-col w-full">
      {React.Children.map(props.children, (child, i) => {
        return React.cloneElement(child as any, {
          _current: props.current,
          _loading: props.loading,
          _last: i + 1 === React.Children.count(props.children),
        });
      })}
    </div>
  );
};

export const Stepper = {
  Container: StepperContainer,
  Step,
};
