import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    experimental: {
        proxyClientMaxBodySize: '50mb'
    }
};

export default nextConfig;
