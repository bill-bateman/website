import React from "react"
import Layout from "../components/layout/layout"

import olomana from "../content/images/olomana.png"
import linkedin from "../content/images/linkedin.png"
import mail from "../content/images/mail.png"

export default function Home() {
  return (
    <Layout title="Bill Bateman" subtitle="Personal Website">
      <p>
      My name is Bill. I am a software developer working remotely in British Columbia.
        <br /><br />
        I use this site for blog posts and personal projects.
        <ul className="nobullets">
          <li><b>Contact:</b></li>
          <li className="email"><img alt="Mail Icon" width="15px" src={mail} />  <b>l</b>b<b>l</b>i<b>l</b>l<b>l</b>l<b>l</b> a<b>l</b>t b<b>l</b>at<b>l</b>ema<b>l</b>nzh<b>l</b>ou do<b>l</b>t co<b>l</b>m</li>
          <li><img alt="LinkedIn Icon" width="15px" src={linkedin} />  <a href="https://www.linkedin.com/in/wsbateman/">Bill Bateman | LinkedIn</a></li>
        </ul>
      </p>
      <img width="100%" alt="Olomana Trail" src={olomana} />
      <p className="imagecaption">Third peak of the Olomana Trail.</p>
    </Layout>
  );
}

