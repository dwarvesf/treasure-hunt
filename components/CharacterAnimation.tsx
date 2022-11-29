import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import useMeasure from "react-use-measure";

const Ground = (props: any) => {
  return (
    <Image
      width={160 * props.scale}
      height={32 * props.scale}
      alt=""
      src="/ground.png"
    />
  );
};

export const CharacterAnimation = (props: any) => {
  const [ref, bounds] = useMeasure();
  return (
    <div ref={ref}>
      <img
        alt=""
        src={props.isRunning ? "/run outline.gif" : "/idle outline.gif"}
        style={{ transform: `scale(${bounds.width / 160})` }}
        className="mx-auto relative z-10"
      />
      <Marquee gradient={false} speed={75} play={Boolean(props.isRunning)}>
        <Ground scale={bounds.width / 160} />
      </Marquee>
    </div>
  );
};
