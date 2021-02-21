import React from "react"
import Layout from "../components/layout"
import killarney from "../content/images/killarney.png"

export default function Home() {
  return (
    <Layout title="About" subtitle="">
      <p>
        My name is Bill. I am a software developer working remotely in British Columbia.
        <br /><br />
        My interests include: <br/>
        <ul className="nobullets">
        	<li><b>Computers.</b> My undergraduate degree, and now my career, both relate to computers.</li>
        	<li><b>Music.</b> I play trumpet and piano, and occasionally transcribe jazz solos.</li>
        	<li><b>Outdoors.</b> See below photo from Killarney Provincial Park, Ontario.</li>
        </ul>
      </p>
      <img width="100%" alt="Killarney Provincial Park" src={killarney} />
      <p className="imagecaption">Canoe-camping in Killarney.</p>
    </Layout>
  );
}

