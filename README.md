We're working on a widget that displays recommendations from Taboola's API, 
within a larger application. However, fetching data directly from this 
service while developing locally poses a challenge due to CORS restrictions, which prevent 
cross-origin requests. To overcome this, we utilize CORS Anywhere, 
a tool that acts as a proxy server. By running a local instance of CORS Anywhere, 
we can bypass CORS restrictions during development. This proxy server fetches data from the 
external service on behalf of our widget, allowing it to retrieve recommendations without encountering CORS errors. 
We start the local server by running the CORS Anywhere script in our terminal,  using the command node server.js 
inside the cors-anywhere dir. Once the server is up and running, our widget can communicate 
with it via http://localhost:8080, or the specified host and port, to fetch recommendations seamlessly.

