import { Map } from "pigeon-maps";
import { osm } from "pigeon-maps/providers";
import { useGeolocated } from "react-geolocated";
import Head from "next/head";
import Image from "next/image";
import { CharacterAnimation } from "../components/CharacterAnimation";
import Marquee from "react-fast-marquee";

export default function Home() {
  const { coords, isGeolocationEnabled, isGeolocationAvailable } =
    useGeolocated();

  return (
    <div className="overflow-hidden flex w-screen h-screen relative">
      <Head>
        <title>Treasure Hunt</title>
        <link rel="icon" href="/idle static.png" />
      </Head>
      <Map
        provider={osm}
        center={[coords?.latitude ?? 0, coords?.longitude ?? 0]}
        defaultZoom={18}
        attribution={false}
      />
      <div className="fixed w-screen h-screen bg-black/70" />
      <div className="overflow-hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow rounded bg-white border-2 border-emerald-800">
        <div className="text-emerald-100 flex flex-col relative w-[768px] h-[432px]">
          {Array(5)
            .fill(0)
            .map((_, i) => {
              return (
                <div className="absolute top-0 left-0 h-full w-full">
                  <Marquee
                    key={`parallax-bg-${i}`}
                    gradient={false}
                    speed={(i + 1) * 15}
                    play
                  >
                    <Image
                      width={768}
                      height={432}
                      src={`/plx-${i + 1}.png`}
                      alt=""
                    />
                  </Marquee>
                </div>
              );
            })}
          <p className="mt-5 title text-5xl relative z-10 text-center">
            treasure hunt
          </p>
          <div className="mt-5 mx-auto w-4/5 relative z-10 rounded bg-emerald-900 bg-opacity-[85%] p-3 flex justify-between">
            <div className="flex flex-col">
              <p className="underline font-medium text-lg">
                To play this game, you'll need:
              </p>
              <ul className="text-sm mt-2 list-disc list-inside">
                <li>A browser that support geolocation</li>
                <li>Allow the browser to track your location</li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="underline font-medium text-lg">Rules of the game</p>
              <ul className="text-sm mt-2 list-decimal list-inside">
                <li>Go to the location</li>
                <li>Reveal and answer the question</li>
                <li>Go to the next location</li>
                <li>Answer all questions as soon as you can to win</li>
              </ul>
            </div>
          </div>
          <div className="mt-auto">
            <CharacterAnimation scale={3} isRunning />
          </div>
        </div>
      </div>
    </div>
  );
}
