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
  const scale = props.scale ?? 1;
  const imageScale = bounds.width / (160 * scale);
  return (
    <div ref={ref}>
      <Image
        width={props.isRunning ? 23 : 21}
        height={props.isRunning ? 34 : 35}
        alt=""
        src={props.isRunning ? "/run outline.gif" : "/idle outline.gif"}
        style={{
          transform: `scale(${imageScale})`,
        }}
        className="mx-auto relative z-10"
      />
      <Marquee gradient={false} speed={200} play={Boolean(props.isRunning)}>
        {Array(scale)
          .fill(0)
          .map((_, i) => {
            return <Ground key={`ground-${i}`} scale={imageScale} />;
          })}
      </Marquee>
    </div>
  );
};
