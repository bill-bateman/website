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
  const Posts = edges.map(edge => <PostLink key={edge.node.id} post={edge.node} />)
  //get all categories (first part of slug)
  var Categories = [...new Set(edges.map(edge => edge.node.frontmatter.slug.split('/')[1]))]
  Categories.sort()
  //get all subcategories (second part of slug)
  var Subcategories = [...new Set(edges.map(edge => edge.node.frontmatter.slug.split('/')).map(edges => edges[1]+"/"+edges[2]))]
  Subcategories.sort()
  //create a map from category to subcategory
  var subcat_dict = {};
  for (var i=0; i<Categories.length; i++) {
    subcat_dict[Categories[i]] = [];
  }
  for (i=0; i<Subcategories.length; i++) {
    subcat_dict[Subcategories[i].split('/')[0]].push(Subcategories[i].split('/')[1]);
  }
  //render
  return <Layout title="Posts" subtitle="Sorted by date">
    <FilterPosts categories={Categories} subcategories={subcat_dict}>
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