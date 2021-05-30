import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Img from "gatsby-image"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark

  if (frontmatter.featuredImage === null) {
    return (
      <Layout title={frontmatter.title} subtitle={frontmatter.date}>
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
      </Layout>
    )
  } else {
    return (
      <Layout title={frontmatter.title} subtitle={frontmatter.date}>
        <Img fluid={frontmatter.featuredImage.childImageSharp.fluid} />
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
      </Layout>
    )
  }
}
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
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