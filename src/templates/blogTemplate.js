import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../components/layout/layoutmdx.js"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { mdx } = data // data.markdownRemark holds your post data
  const { frontmatter, body } = mdx

  if (frontmatter.featuredImage === null) {
    return (
      <Layout title={frontmatter.title} subtitle={frontmatter.date}>
        <MDXRenderer>{body}</MDXRenderer>
      </Layout>
    )
  } 
  return (
    <Layout title={frontmatter.title} subtitle={frontmatter.date}>
      <Img fluid={frontmatter.featuredImage.childImageSharp.fluid} />
      <MDXRenderer>{body}</MDXRenderer>
    </Layout>
  )
}
export const pageQuery = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`