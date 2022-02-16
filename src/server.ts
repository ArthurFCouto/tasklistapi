import app from './app';

const port = process.env.PORT || 3030;
app.listen(port, ()=> `Server running on port ${port}`);