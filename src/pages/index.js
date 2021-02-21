import React from "react"
import Layout from "../components/layout"
import olomana from "../content/images/olomana.png"

export default function Home() {
  return (
    <Layout title="Bill Bateman" subtitle="Personal Website">
      <p>
        Welcome to my website.
        <br /><br />
        I use this site for a variety of things, including: resume, blog posts, solo transcriptions, explorations of different computer science topics, and notes.
      </p>
      <img width="100%" alt="Olomana Trail" src={olomana} />
      <p className="imagecaption">Third peak of the Olomana Trail.</p>
    </Layout>
  );
}

