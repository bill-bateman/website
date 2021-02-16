import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

const PostLink = ({ post }) => (
  <div>
    <Link to={post.frontmatter.slug}>
    	<Img fluid={post.frontmatter.featuredImage.childImageSharp.fluid} />
      {post.frontmatter.title} ({post.frontmatter.date})
    </Link>
  </div>
)
export default PostLink