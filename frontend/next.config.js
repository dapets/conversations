/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/chats",
                permanent: true
            }
        ]
    }
}

module.exports = nextConfig
