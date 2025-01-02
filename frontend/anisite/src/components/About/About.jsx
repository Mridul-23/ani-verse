import React from "react";
import FeatureCard from "./FeatureCard";
import "./about.css";

const About = () => {
  return (
    <div className="bg-transparent mt-6 text-gray-200 font-sans">
      <section className="bg-gray-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-semibold uppercase font-poppins text-center text-highlight mb-10">
            Why Choose Aniverse?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Discover New Anime"
              description="Get personalized recommendations for anime based on your preferences and explore new favorites."
              icon="📚"
            />
            <FeatureCard
              title="Community Hub"
              description="Join discussions, share reviews, and connect with like-minded anime enthusiasts."
              icon="👥"
            />
            <FeatureCard
              title="Stay Updated"
              description="Receive the latest updates about your favorite anime series, movies, and news."
              icon="📰"
            />
            <FeatureCard
              title="Interactive Tools"
              description="Use interactive features like ratings, reviews, and watchlists to organize your anime journey."
              icon="⚙️"
            />
            <FeatureCard
              title="Events & Challenges"
              description="Participate in community challenges, trivia, and other exciting events to showcase your love for anime."
              icon="🎉"
            />
            <FeatureCard
              title="Seamless Experience"
              description="Enjoy a modern, user-friendly interface designed with anime fans in mind."
              icon="✨"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col bg-[#23252b] items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl font-poppins uppercase mb-4 font-thin">
          About Aniverse
        </h1>
        <p className="text-lg leading-relaxed max-w-3xl">
          Welcome to{" "}
          <span className="font-semibold text-highlight">Aniverse</span>—your
          ultimate destination for everything anime. Discover, interact, and
          connect with the vibrant anime community, all in one place.
        </p>

        <div className="max-w-4xl my-10 mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">Our Mission</h2>
          <p className="text-center text-lg leading-relaxed">
            At Aniverse, our mission is to bring the anime community closer by
            providing an all-in-one platform for fans to explore and engage.
            From the latest anime series to community events, our goal is to
            make anime accessible, enjoyable, and interactive.
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;
