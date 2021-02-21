import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

const PostLink = ({ post }) => (
  <div name="postlink" data-category={post.frontmatter.slug.split('/')[1]} data-subcategory={post.frontmatter.slug.split('/')[2]}>
  	<hr/>
    <Link to={post.frontmatter.slug} className="listlink">
    	<Img className="listfeature" fluid={post.frontmatter.featuredImage.childImageSharp.fluid} />
      <p className="listinfo">
        {post.frontmatter.slug.split('/')[1]} / {post.frontmatter.slug.split('/')[2]}
        <span>
          {post.frontmatter.date}
        </span>
      </p>
    	<p className="listtext">
    		{post.frontmatter.title}
    	</p>
    </Link>
  </div>
)
export default PostLink