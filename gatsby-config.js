module.exports = {
    plugins: [
    	{
    		resolve: `gatsby-source-filesystem`,
    		options: {
    			path: `${__dirname}/src/md/`,
    			name: `markdown-pages`,
    		},
    	},
    	`gatsby-transformer-remark`,
    ]
}