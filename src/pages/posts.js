import React from "react"
import { graphql } from "gatsby"
import PostLink from "../components/post-link"
import Layout from "../components/layout"
import FilterPosts from "../components/filter-posts"

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  //get all posts
  const FilteredEdges = edges.filter(edge => edge.node.frontmatter.slug.split('/').length > 2); //filter out things like resume.md
  const Posts = FilteredEdges.map(edge => <PostLink key={edge.node.id} post={edge.node} />)
  //get all categories (first part of slug)
  var Categories = [...new Set(FilteredEdges.map(edge => edge.node.frontmatter.slug.split('/')[1]))]
  Categories.sort()
  //render
  return <Layout title="Posts" subtitle="Sorted by date">
    <FilterPosts categories={Categories}>
      {Posts}
    </FilterPosts>
  </Layout>
}
export default IndexPage
export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
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
    }
  }
`