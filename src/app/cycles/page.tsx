import Image from "next/image";

import ScrollButton from "@/components/ui/custom/scroll-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Cycles() {
  return (
    <main className="md:col-span-8">
      <nav className="bg-bg sticky top-0 z-[10000] flex gap-1 pt-16 font-mono text-xs">
        <Button variant="tab" size="tab" asChild>
          <Link href="/">davidschultz.co</Link>
        </Button>
        <span className="border-bd/0 text-ic-tertiary border-b-[1px] px-1 pt-1.5 pb-[7px]">
          /
        </span>
        <Button variant="tab" size="tab" asChild>
          <Link href="/">write-ups</Link>
        </Button>
        <span className="border-bd/0 text-ic-tertiary border-b-[1px] px-1 pt-1.5 pb-[7px]">
          /
        </span>
        <span className="border-bd-base text-tx-primary border-b-[1px] px-1 pt-1.5 pb-[7px]">
          cycles
        </span>
      </nav>

      <article className="text-tx-body mt-16">
        <header>
          <h1 className="text-tx-primary">
            Exploring spatial representations of time
          </h1>
          <h3 className="text-tx-tertiary font-mono">2024 ※ XR prototyping</h3>
          <p className="text-md">
            Building a &quot;time machine&quot; in mixed reality. This course
            was my first encounter with designing in XR. My team designed a new
            type of calendar—one that utilizes 3d-space. I was responsible for
            building a working prototype in Unity for the Quest 3.
          </p>
          <div className="card mb-4">
            <Image
              src="https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/cycles/demo-quick.gif"
              alt="unity demo"
              height={0}
              width={0}
              sizes="225vw"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <small className="text-tx-tertiary">
              In collaboration with Nat Musenga, Maggie Zheng, and Emi White at
              the University of Washington.
            </small>
          </div>
        </header>
        <section>
          <h3 className="border-bd-primary text-tx-primary w-full border-spacing-4 border-b-[1px] border-dashed pb-1 font-mono">
            # Conceptual sketches
          </h3>
          <p>
            How do you represent time in three dimensions? One option is to lay
            it out as a timeline in front of you.
          </p>
          <p>
            Cut off the ends, throw on some events, and call it a day. We gave
            it a shot, but decided that this iteration didn&apos;t work for two
            main reasons; for one, a calendar doesn&apos;t need to occupy a
            user&apos;s full &quot;viewport&quot;. It&apos;s probably better
            suited to the peripheral.
          </p>
          <p>
            Second, and more fundamentally, this linear form factor didn&apos;t
            feel &quot;anchored.&quot; It didn&apos;t give you a sense of where
            you were in your day.
          </p>
          <div className="card mb-4">
            <Image
              src="https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/cycles/linear-shapesxr.png"
              alt="video of me, prototyping with ShapesXR"
              height={0}
              width={0}
              sizes="225vw"
              style={{ width: "100%", height: "auto" }}
            />
            <small className="text-tx-tertiary">fig.1 Early concept</small>
          </div>
        </section>

        <section>
          <p>
            What if, instead, we modeled it after a clock? This way, the user
            would always be able to relate the current time to the current
            cycle.
          </p>
          <p>
            We ended up really digging this idea, and coming up with a few
            tricks to work within the new constraints of a form that lacks a
            defined start/end.
          </p>
          <div className="flex gap-4">
            <div className="card">
              <Image
                src="https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/cycles/desk-sketch-2-cropped.png"
                alt="desk sketch of a design iteration"
                height={0}
                width={0}
                sizes="225vw"
                style={{ width: "100%", height: "auto" }}
              />
              <small className="text-tx-tertiary">fig.2 Desk concept</small>
            </div>
            <div className="card">
              <Image
                src="https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/cycles/shapesxr-cropped.png"
                alt="design iteration in ShapesXR"
                height={0}
                width={0}
                sizes="225vw"
                style={{ width: "100%", height: "auto" }}
              />
              <small className="text-tx-tertiary">fig.2 Desk concept</small>
            </div>
          </div>
        </section>

        <section>
          <h3 className="border-bd-primary text-tx-primary w-full border-spacing-4 border-b-[1px] border-dashed pb-1 font-mono">
            # Unity development
          </h3>
          <p>
            From the get-go, my team had been prototyping in ShapesXR on my
            teammate&apos;s Quest 2. The controls took some getting used-to, and
            it was difficult to collaborate—but the power of working in an
            immersive environment was immediately apparent.
          </p>
          <p>Thinking long-term, I noticed two major problems:</p>
          <ol className="styled text-md mb-4">
            <li>
              We needed to be able to record passthrough, which isn&apos;t
              possible on Quest 2.
            </li>
            <li>
              ShapesXR&apos;s limited interaction capabilities were becoming a
              obstacle for ideation.
            </li>
          </ol>
          <p>
            With a clear need, and a strong desire to explore XR, I pulled the
            trigger and saddled up to learn Unity.
          </p>
        </section>
      </article>

      <ScrollButton />
    </main>
  );
}
