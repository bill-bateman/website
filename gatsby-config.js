module.exports = {
	siteMetadata: { //for rss feed
		title: `Bill's Blog`,
		author: `Bill`,
		description: `Posts by Bill`,
		siteUrl: `https://bill.batemanzhou.com`,
	},
    plugins: [
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Bill's Blog`,
				description: `Posts by Bill`,
				icon: `src/content/images/favicon.png`,
				lang: `en`,
				start_url: `/`,
			}
		},
		{
    		resolve: `gatsby-source-filesystem`,
    		options: {
    			path: `${__dirname}/src/content/data/`,
    			name: `data`,
    		},
    	},
		{
    		resolve: `gatsby-source-filesystem`,
    		options: {
    			path: `${__dirname}/src/content/art/`,
    			name: `art`,
    		},
    	},
    	{
    		resolve: `gatsby-source-filesystem`,
    		options: {
    			path: `${__dirname}/src/content/blog/`,
    			name: `blog`,
    		},
    	},
    	{
    		resolve: `gatsby-source-filesystem`,
    		options: {
    			path: `${__dirname}/src/content/transcriptions/`,
    			name: `transcriptions`,
    		},
    	},
		{
    		resolve: `gatsby-source-filesystem`,
    		options: {
    			path: `${__dirname}/src/content/games/`,
    			name: `games`,
    		},
    	},
		{
    		resolve: `gatsby-source-filesystem`,
    		options: {
    			path: `${__dirname}/src/content/computers/`,
    			name: `computers`,
    		},
    	},
	    {
	      resolve: `gatsby-source-filesystem`,
	      options: {
	        path: `${__dirname}/src/content/images/`,
	      },
	    },
	    {
	    	resolve: `gatsby-plugin-mdx`,
	    	options: {
				extensions: [`.mdx`, `.md`],
	    		gatsbyRemarkPlugins: [
	    			{
	    				resolve: `gatsby-remark-images`,
	    				options: {
	    					maxWidth: 650,
	    					quality: 100,
	    				},
	    			},
					{
						resolve: `gatsby-remark-katex`,
						options: {
							strict: `ignore`,
						},
					},
	    		],
	    	},
	    },
	    `gatsby-plugin-sharp`,
		`gatsby-transformer-sharp`,
		`gatsby-remark-images`,
		{
			resolve: `gatsby-plugin-feed-mdx`,
			options: {
				query: `
				  {
		            site {
		              siteMetadata {
		                title
		                description
		                siteUrl
		                site_url: siteUrl
		              }
		            }
		          }
				`,
				feeds: [
					{
						serialize: ({ query: { site, allMdx } }) => {
							return allMdx.edges
								.filter(edge => edge.node.frontmatter.slug.split('/').length === 3) //filter out things like resume.md, and notes, that have more or less than 2 slashes in the slug
								.map(edge => {
									return Object.assign({}, edge.node.frontmatter, {
										description: edge.node.excerpt,
										date: edge.node.frontmatter.date,
										url: site.siteMetadata.siteUrl + edge.node.frontmatter.slug,
										guid: site.siteMetadata.siteUrl + edge.node.frontmatter.slug,
										custom_elements: [{ "content:encoded": edge.node.html }],
									})
								});
						},
						query: `
			              {
							allMdx(
								sort: { order: DESC, fields: [frontmatter___date] },
							  ) {
								edges {
								  node {
									excerpt
									html
									frontmatter {
									  title
									  date
									  slug
									}
								  }
								}
							  }
			              }
			              `,
			              output: "/rss.xml",
					}
				],
			}
		},
    ]
}