import React from "react"
import Layout from "../components/layout"

export default function Home() {
  return (
    <Layout title="License" subtitle="Creative Commons, MIT, Public Domain">
      <p>
        Original contents of this blog, such as text, images, and music, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>, except where the original work is in the public domain, or otherwise indicated.
        <br /><br />
        The underlying source code, and any source code contained within blog posts, are licensed under the <a href="mit-license">MIT license</a> unless otherwise indicated.
      </p>
    </Layout>
  );
}

