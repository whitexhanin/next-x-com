/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites(){
    return [
      {
        source : "/upload/:slug",
        destination: "http://localhost:9090/upload/:slug",
      },
    ]
  }
}
const path = require('path')

module.exports = {
    sassOptions: {
        // fiber: false,
        includePaths: [path.join(__dirname, 'styles')],  
        // prependData: `@import '@/app/styles/mixins';@ import '@/app/styles/variables'`
      },
}

module.exports = nextConfig;