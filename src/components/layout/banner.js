import React from "react"
import banner from "../../content/images/banner.jpg"

function NavBar() {
	return (<div className="navbar">
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/posts">Posts</a></li>
			<li><a href="/rss.xml">RSS</a></li>
		</ul>
	</div>);
}

export default function Banner() {
	return (<div style={{minHeight:"75px"}}>
		<img className="banner" width="100%" height="50px" alt="Banner" src={banner} />
		<NavBar />
	</div>)
}