import React from "react";
import FeatureCard from "./FeatureCard";
import "./about.css";

const About = () => {
  return (
    <div className="bg-transparent mt-6 text-gray-200 font-sans">

      <section className="bg-gray-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-semibold uppercase font-poppins text-center text-highlight mb-10">
            What is Ani-Verse?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Discover Anime"
              description="Explore anime across different genres and discover titles you may not have encountered before."
              icon="📚"
            />

            <FeatureCard
              title="Smart Recommendations"
              description="Get anime recommendations based on your interests and interactions to help uncover your next favorite."
              icon="🎯"
            />

            <FeatureCard
              title="Powerful Search"
              description="Search through the anime catalogue and find titles using more than just what you already know."
              icon="🔎"
            />

            <FeatureCard
              title="Explore by Genre"
              description="Browse anime through genres and explore collections that make discovering something new easier."
              icon="🗂️"
            />

            <FeatureCard
              title="Anime Details"
              description="Dive into individual anime and explore the information available for each title in the catalogue."
              icon="📖"
            />

            <FeatureCard
              title="Your Anime Space"
              description="Use your account to keep track of the anime you care about and build your own collection."
              icon="✨"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col bg-[#23252b] items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl font-poppins uppercase mb-4 font-thin">
          About AniVerse
        </h1>

        <p className="text-lg leading-relaxed max-w-3xl">
          <span className="font-semibold text-highlight">Ani-Verse</span> is
          an anime discovery and recommendation platform built to help you
          explore anime, discover new titles, and find something worth
          watching.
        </p>

        <div className="max-w-4xl my-10 mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">
            Built for Discovery
          </h2>

          <p className="text-center text-lg leading-relaxed">
            Ani-Verse combines anime search, genre-based exploration, and
            recommendation systems to make finding anime more engaging.
            Whether you already know what you want to watch or are looking
            for something completely new, Ani-Verse is built around the
            simple idea of making anime discovery easier.
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;
