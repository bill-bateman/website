import React from "react"
import banner from "../images/banner2.jpg"

function Banner() {
	return (<div style={{minHeight:"75px"}}>
		<img class="banner" width="100%" height="50px" alt="Banner" src={banner} />
	</div>)
}

function Header(props) {
	return (<div class="header">
		<h1>{props.title}</h1>
		<h2>{props.subtitle}</h2>
	</div>);
}

export default function Layout(props) {
  return (<>
  	<Banner />
    <Header title={props.title} subtitle={props.subtitle}/>
    <div class="content">
    	{props.children}
    </div>
  </>)
}