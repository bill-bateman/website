import React from "react"

export default function Footer() {
	return (<div className="footer">
		<hr />
		<ul>
			<li><p style={{textAlign:"left"}}><a href="license">License Info</a></p></li>
			<li><p style={{textAlign:"center"}}>Website Created with <a href="https://gatsbyjs.com">Gatsby</a></p></li>
			<li><p style={{textAlign:"right"}}><a href="https://github.com/bill-bateman/website">Website Source Code</a></p></li>
		</ul>
	</div>);
}
