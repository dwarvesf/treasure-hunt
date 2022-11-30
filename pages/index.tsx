import { Map, Marker } from "pigeon-maps";
import { osm } from "pigeon-maps/providers";
import { useGeolocated } from "react-geolocated";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const { query } = useRouter();
  const { coords } = useGeolocated();

  const currentPos: [number, number] = [
    coords?.latitude ?? 0,
    coords?.longitude ?? 0,
  ];

  const [center, setCenter] = useState(currentPos);

  const [show, setShow] = useState(false);

  const [springs, api] = useSpring(
    () =>
      show
        ? {
            to: {
              y: "0%",
            },
          }
        : {
            to: {
              y: "48%",
            },
          },
    [show]
  );

  const onSubmit = () => {
    api.start({
      to: {
        y: "48%",
      },
      onRest: () => {},
    });
  };

  const [running, setRunning] = useState(false);

  useEffect(() => {
    setCenter([coords?.latitude ?? 0, coords?.longitude ?? 0]);
  }, [coords]);

  return (
    <div className="overflow-hidden flex w-screen h-screen relative">
      <Head>
        <title>Treasure Hunt</title>
        <link rel="icon" href="/idle static.png" />
      </Head>
      <Map
        provider={osm}
        center={center}
        defaultZoom={18}
        attribution={false}
        animateMaxScreens={30}
        onAnimationStop={() => api.start({ to: { y: "0%" } })}
        onBoundsChanged={() => setRunning(true)}
        onClick={() => setRunning(true)}
      >
        <Marker anchor={currentPos} color="#e03e5e" width={56}></Marker>
      </Map>
      <animated.div onClick={() => setShow((s) => !s)} style={springs}>
        <div className="md:hidden">
          <Menu
            onSubmit={onSubmit}
            isRunning={running}
            setRunning={setRunning}
          />
        </div>
      </animated.div>
      <div className="hidden md:block">
        <Menu onSubmit={onSubmit} isRunning={running} setRunning={setRunning} />
      </div>
    </div>
  );
}
