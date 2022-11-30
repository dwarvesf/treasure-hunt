import { Map, Marker } from "pigeon-maps";
import { osm } from "pigeon-maps/providers";
import { useGeolocated } from "react-geolocated";
import { animated, useSpring } from "@react-spring/web";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Menu } from "../components/Menu";
import API from "../api";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import Script from "next/script";
import Image from "next/image";
import haversine from "haversine-distance";
import { useSwipeable } from "react-swipeable";

const RANGE_METER = 50;

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

  const currentPos: [number, number] = useMemo(
    () => [coords?.latitude ?? 0, coords?.longitude ?? 0],
    [coords]
  );

  const [center, setCenter] = useState(currentPos);
  const [nextLocation, setNextLocation] = useState(currentPos);

  const isWithinRange = useMemo(() => {
    if (
      typeof currentPos[0] === "number" &&
      typeof currentPos[1] === "number" &&
      !Number.isNaN(currentPos[0]) &&
      !Number.isNaN(currentPos[1])
    ) {
      const distance = haversine(
        {
          lat: currentPos[0],
          lon: currentPos[1],
        },
        {
          lat: nextLocation[0],
          lon: nextLocation[1],
        }
      );
      console.log(distance);
      return distance <= RANGE_METER;
    }
    return false;
  }, [currentPos, nextLocation]);

  const { data: currentQuestion } = useSWR(
    [
      "/questions",
      isWithinRange,
      query.team,
      teamRes?.data?.clue?.question_code,
    ],
    async (_, isWithinRange, teamId, questionCode) => {
      if (isWithinRange && teamId && questionCode) {
        const res = await API.getQuestion(teamId as string, questionCode);
        return res?.data?.content ?? null;
      }
      return null;
    }
  );

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
              y: "90%",
            },
          },
    [show]
  );

  const updateNextLocation = useCallback<
    (l: string) => [number, number] | null
  >((location) => {
    let decoded;
    try {
      decoded = window.OpenLocationCode.decode(location);
    } catch {}
    if (decoded) {
      const { latitudeCenter: lat, longitudeCenter: lon } = decoded;
      setNextLocation([lat, lon]);
      return [lat, lon];
    }
    return null;
  }, []);

  const onSubmit = async (clueId: string, answer: string) => {
    const answerRes = await API.answerClue(clueId, answer);
    if (answerRes?.success) {
      return refreshTeam().then((newClue) => {
        const clue = newClue?.data?.clue;
        if (clue) {
          return new Promise((r) => {
            api.start({
              to: {
                y: "90%",
              },
              onResolve: () => {
                const coords = updateNextLocation(clue.location);
                if (coords) {
                  setCenter(coords);
                  r(true);
                }
                r(false);
              },
            });
          });
        } else if (newClue?.data?.status === "completed") {
          return true;
        }
        return false;
      });
    }
    return Promise.resolve(false);
  };

  const [running, setRunning] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setShow(true),
    onSwipedDown: () => setShow(false),
  });

  useEffect(() => {
    setCenter([coords?.latitude ?? 0, coords?.longitude ?? 0]);
  }, [coords]);

  useEffect(() => {
    if (clue?.clue?.location) {
      updateNextLocation(clue.clue.location);
    }
  }, [clue, updateNextLocation]);

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
        <Marker anchor={nextLocation} color="#e03e5e" width={56}></Marker>
        <Marker anchor={currentPos}>
          <Image src="/idle outline.gif" width={21} height={35} alt="" />
        </Marker>
      </Map>
      <div className="md:hidden h-screen fixed right-2 flex">
        <div className="flex-1 relative">
          <animated.div
            {...swipeHandlers}
            className="absolute bottom-0 right-0"
            style={springs}
          >
            <Menu
              clue={clue}
              onSubmit={onSubmit}
              recenter={() => setCenter(currentPos)}
              goToDestination={() => setCenter(nextLocation)}
              isRunning={running}
              setRunning={setRunning}
              isWithinRange={isWithinRange}
              currentQuestion={currentQuestion}
            />
          </animated.div>
        </div>
      </div>
      <div className="hidden md:block">
        <Menu
          clue={clue}
          onSubmit={onSubmit}
          recenter={() => setCenter(currentPos)}
          goToDestination={() => setCenter(nextLocation)}
          isRunning={running}
          setRunning={setRunning}
          isWithinRange={isWithinRange}
          currentQuestion={currentQuestion}
        />
      </div>
    </div>
  );
}
