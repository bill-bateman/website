module.exports = {
    plugins: [
    	{
    		resolve: `gatsby-source-filesystem`,
    		options: {
    			path: `${__dirname}/src/blog/`,
    			name: `blog`,
    		},
    	},
	    {
	      resolve: `gatsby-source-filesystem`,
	      options: {
	        path: `${__dirname}/src/images/`,
	      },
	    },
	    {
	    	resolve: `gatsby-transformer-remark`,
	    	options: {
	    		plugins: [
	    			{
	    				resolve: `gatsby-remark-images`,
	    				options: {
	    					maxWidth: 650,
	    				},
	    			},
	    		],
	    	},
	    },
	    `gatsby-plugin-sharp`,
		`gatsby-transformer-sharp`,
		`gatsby-remark-images`,
    ]
}