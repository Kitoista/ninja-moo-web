export const environment = {
    production: true,
    appHost: "localhost:4201",
    urls: {
        get: {
            status: "/status",
        },
        post: {
            host: "/host",
            kill: "/kill",
            upload: "/upload",
        }
    }
};
