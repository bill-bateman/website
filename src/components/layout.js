import React from "react"
import banner from "../content/images/banner2.jpg"

function Banner() {
	return (<div style={{minHeight:"75px"}}>
		<img className="banner" width="100%" height="50px" alt="Banner" src={banner} />
	</div>)
}

function Header(props) {
	return (<div className="header">
		<h1>{props.title}</h1>
		<h2>{props.subtitle}</h2>
	</div>);
}

export default function Layout(props) {
  return (<>
  	<Banner />
    <Header title={props.title} subtitle={props.subtitle}/>
    <div className="content">
    	{props.children}
    </div>
  </>)
}