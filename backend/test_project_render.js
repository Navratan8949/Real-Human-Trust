const axios = require('axios');

async function test() {
    try {
        console.log("Fetching project from Render...");
        const res = await axios.get('https://real-human-trust.onrender.com/api/v1/projects/6a741aa7fc3abfb2c2135e9c');
        console.log("RENDER PROJECT RESPONSE:", res.data);
    } catch (err) {
        console.log("RENDER PROJECT ERROR:", err.response ? { status: err.response.status, data: err.response.data } : err.message);
    }

    try {
        console.log("Fetching all projects from Render...");
        const res2 = await axios.get('https://real-human-trust.onrender.com/api/v1/projects');
        console.log("RENDER ALL PROJECTS:", res2.data.projects?.map(p => ({ id: p._id, title: p.title })));
    } catch (err) {
        console.log("RENDER ALL PROJECTS ERROR:", err.response ? { status: err.response.status, data: err.response.data } : err.message);
    }
}

test();
