import React from "react"
import {MDXProvider} from "@mdx-js/react"

import FigureText from "../shortcodes/FigureText.js"
import MyImage from "../shortcodes/MyImage.js"
import Layout from "./layout.js"

const shortcodes = {FigureText, MyImage};

export default function LayoutMdx(props) {
  return (<MDXProvider components={shortcodes}>
    <Layout {...props} />
  </MDXProvider>)
}