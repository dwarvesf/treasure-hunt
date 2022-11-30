import { Map, Marker } from "pigeon-maps";
import { osm } from "pigeon-maps/providers";
import { useGeolocated } from "react-geolocated";
import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import { Menu } from "../components/Menu";
import API from "../api";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import Script from "next/script";
import Image from "next/image";

export default function Home() {
  const { query } = useRouter();
  const { data: teamRes, mutate: refreshTeam } = useSWR(
    ["/teams", query.team],
    (_, team) => API.getTeam(team as string)
  );
  const clue = teamRes?.data;

  const { coords } = useGeolocated({
    watchPosition: true,
  });

  const currentPos: [number, number] = [
    coords?.latitude ?? 0,
    coords?.longitude ?? 0,
  ];

  const [center, setCenter] = useState(currentPos);
  const [nextLocation, setNextLocation] = useState(currentPos);

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

  const onSubmit = async (clueId: string, answer: string) => {
    const answerRes = await API.answerClue(clueId, answer);
    if (answerRes?.success) {
      return refreshTeam().then((newClue) => {
        const clue = newClue?.data?.clue;
        if (clue) {
          return new Promise((r) => {
            api.start({
              to: {
                y: "48%",
              },
              onResolve: () => {
                const decoded = window.OpenLocationCode.decode(clue.location);
                if (decoded) {
                  const { latitudeCenter: lat, longitudeCenter: lon } = decoded;
                  setCenter([lat, lon]);
                  setNextLocation([lat, lon]);
                  r(true);
                } else {
                  r(false);
                }
              },
            });
          });
        }
        return false;
      });
    }
    return Promise.resolve(false);
  };

  const [running, setRunning] = useState(false);

  useEffect(() => {
    setCenter([coords?.latitude ?? 0, coords?.longitude ?? 0]);
  }, [coords]);

  return (
    <div className="overflow-hidden flex w-screen h-screen relative">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/openlocationcode/1.0.3/openlocationcode.min.js" />
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
        onBoundsChanged={({ center }) => {
          setCenter(center);
          setRunning(true);
        }}
        onClick={() => setRunning(true)}
      >
        <Marker anchor={currentPos}>
          <Image src="/idle outline.gif" width={21} height={35} alt="" />
        </Marker>
        <Marker anchor={nextLocation} color="#e03e5e" width={56}></Marker>
      </Map>
      <animated.div onClick={() => setShow((s) => !s)} style={springs}>
        <div className="md:hidden">
          <Menu
            clue={clue}
            onSubmit={onSubmit}
            recenter={() => setCenter(currentPos)}
            isRunning={running}
            setRunning={setRunning}
          />
        </div>
      </animated.div>
      <div className="hidden md:block">
        <Menu
          clue={clue}
          onSubmit={onSubmit}
          recenter={() => setCenter(currentPos)}
          isRunning={running}
          setRunning={setRunning}
        />
      </div>
    </div>
  );
}
