import React from "react"
import {MDXProvider} from "@mdx-js/react"

import banner from "../content/images/banner.jpg"
import FigureText from "./shortcodes/FigureText.js"
import MyImage from "./shortcodes/MyImage.js"

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

function GoatCounter() {
	return (<script data-goatcounter="https://batemanzhouanalytics.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>)
}

const shortcodes = {FigureText, MyImage};

export default function Layout(props) {
  return (<MDXProvider components={shortcodes}>
	<GoatCounter />
  	<Banner />
    <Header title={props.title} subtitle={props.subtitle}/>
    <div className="content">
    	{props.children}
    </div>
    <Footer />
  </MDXProvider>)
}