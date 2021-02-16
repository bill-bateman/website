module.exports = {
    plugins: [
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
	        path: `${__dirname}/src/content/images/`,
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
	    					quality: 100,
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