import React from "react"
import banner from "../content/images/banner2.jpg"

function Banner() {
	return (<div style={{minHeight:"75px"}}>
		<img className="banner" width="100%" height="50px" alt="Banner" src={banner} />
		<NavBar />
	</div>)
}

function NavBar() {
	return (<div className="navbar">
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/posts">Posts</a></li>
			<li><a href="/resume">Resume</a></li>
			<li><a href="/about">About</a></li>
			<li><a href="/rss.xml">RSS</a></li>
		</ul>
	</div>);
}

function Header(props) {
	return (<div className="header">
		<h1>{props.title}</h1>
		<h2>{props.subtitle}</h2>
	</div>);
}

function Footer() {
	return (<div className="footer">
		<hr />
		<ul>
			<li><p style={{textAlign:"left"}}><a href="license">License Info</a></p></li>
			<li><p style={{textAlign:"center"}}>Website Created with <a href="https://gatsbyjs.com">Gatsby</a></p></li>
			<li><p style={{textAlign:"right"}}><a href="https://github.com/bill-bateman/website">Website Source Code</a></p></li>
		</ul>
	</div>);
}

export default function Layout(props) {
  return (<>
  	<Banner />
    <Header title={props.title} subtitle={props.subtitle}/>
    <div className="content">
    	{props.children}
    </div>
    <Footer />
  </>)
}