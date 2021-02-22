import React from "react"
import Layout from "../components/layout"
import killarney from "../content/images/killarney.png"
import linkedin from "../content/images/linkedin.png"
import mail from "../content/images/mail.png"

export default function Home() {
  return (
    <Layout title="About" subtitle="">  
      My name is Bill. I am a software developer working remotely in British Columbia.
      <br />
      <ul className="nobullets">
        <li><b>Contact:</b></li>
        <li><img alt="Mail Icon" width="15px" src={mail} />  bill at batemanzhou dot com</li>
        <li><img alt="LinkedIn Icon" width="15px" src={linkedin} />  <a href="https://www.linkedin.com/in/william-bateman-8aaa91107/">Bill Bateman | LinkedIn</a></li>
      </ul>
      <ul className="nobullets">
        <li><b>My interests include:</b></li>
      	<li><i>Computers.</i> My undergraduate degree, and now my career, both relate to computers.</li>
      	<li><i>Music.</i> I play trumpet and piano, and occasionally transcribe jazz solos.</li>
      	<li><i>Outdoors.</i> See below photo from Killarney Provincial Park, Ontario.</li>
      </ul>
      <img width="100%" alt="Killarney Provincial Park" src={killarney} />
      <p className="imagecaption">Canoe-camping in Killarney.</p>
    </Layout>
  );
}

