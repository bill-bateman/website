import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Img from "gatsby-image"

function edit_pdf_path(html, public_urls) {
  let html2 = html;
  //change path of pdf to the public url
  var re = /[a-z0-9-_]*\.pdf/g;
  var match = "";
  while ((match = re.exec(html)) !== null) {
    for (let n in public_urls['edges']) {
      if (public_urls['edges'][n]['node']['relativePath']===match[0]) {
        html2=html2.replace(match[0], public_urls['edges'][n]['node']['publicURL']);
        break;
      }
    }
  }
  return html2;
}

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark, allFile } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  let html2 = edit_pdf_path(html, allFile);

  return (
    <Layout title={frontmatter.title} subtitle={frontmatter.date}>
      <Img fluid={frontmatter.featuredImage.childImageSharp.fluid} />
      <div dangerouslySetInnerHTML={{ __html: html2 }}></div>
    </Layout>
  )
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
    allFile(filter: { extension: { eq: "pdf" } }) {
      edges {
        node {
          publicURL
          relativePath
        }
      }
    }
  }
`