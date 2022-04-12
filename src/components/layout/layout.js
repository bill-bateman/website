import React from "react"

import Banner from "./banner.js"
import Footer from "./footer.js"
import Header from "./header.js"
import GoatCounter from "./goatcounter.js"

export default function Layout(props) {
  return <div>
	<GoatCounter />
  	<Banner />
    <Header title={props.title} subtitle={props.subtitle}/>
    <div className="content">
    	{props.children}
    </div>
    <Footer />
  </div>
}