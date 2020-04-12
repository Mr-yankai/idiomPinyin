module.exports = function(url) {
    return new Promise((resolve, reject ) => {
        const http = /^https:/.test(url) ? require("https") : require("http");
        http.get(url, res => {
            let chunk = '';
            res.on('data', d => chunk += d);
            res.on('end', () => resolve(chunk.toString()));
        }).on('error', reject);
    });
}