# Multi-chat Reader

![image](https://github.com/navarr/multi-stream-chat/assets/145128/fdf22578-00fd-41e6-bde4-1e38446de6e2)

## Supports
* Twitch
* TikTok (mostly)
* YouTube

## How to Setup

1. Install Node.JS & Bower
2. [Download and extract the code](https://github.com/navarr/multi-stream-chat/archive/refs/heads/master.zip)
3. `npm install`
4. `cd pub;bower install`
5. Rename `.env.sample` to `.env`

### NGrok
To authenticate with Twitch OAuth, this program currently requires ngrok to be running.  For ease of use, we recommend
using your free ngrok domain.

1. Login or create an account at Ngrok.com
2. Install and configure the appropriate ngrok agent
3. Under Cloud Edge > Domains, create a new domain
4. Launch ngrok in your CLI, connecting to your domain `ngrok http --domain=your-free-domain.ngrok-free.app http://localhost:8082`
   * Replace 8082 with whatever PORT you have configured in your .env file (8082 is default)
   * Set your `TWITCH_OAUTH_REDIRECT_URL` to `https://your-free-domain.ngrok-free.app/oauth-authorize`

### Twitch
1. Register a Twitch app at https://dev.twitch.tv/
2. Set your Redirect URL to `https://your-free-domain.ngrok-free.app/oauth-authorize`
3. Set your `.env` file `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET` based on the app you've created

### YouTube
1. Navigate to https://console.cloud.google.com
2. Create a New Project
3. Register for YouTube Data API v3
4. Navigate to Credentials
5. Click "Create Credentials" and "API key"
6. Set your API key as `YOUTUBE_API_KEY`

### TikTok

**WARNING**: TikTok compatibility is not perfect.  Some messages from certain users will just never show up.  I haven't
figured this out yet.

1. Optionally, you can set your cookie SESSION_ID in the `.env` file and this may help some messages display

## Connecting

Once you have Ngrok running (NGrok Step 4), you can run `node server.js` to start the application.
Then, proceed to `https://your-free-domain.ngrok-free.app/admin.html` to control the app, and 
`https://your-free-domain.ngrok-free.app/` to view chat.  This can definitely be set as an OBS Panel source, and I 
highly recommend you do so!

### Connecting Twitch

* On your admin.html page, there will be a hyperlink to OAuth authorize with Twitch

### Connecting YouTube

* On your admin.html page, insert the Video ID for the YouTube LIVE you want to watch the comments of and click the 
  button.  It will start processing the comments and will stop when you either hit your API call limit or the YouTube 
  LIVE ends.

### Connecting TikTok

* On your admin.html page, put your username in the field and click the connect button.  The username must ALREADY BE
  LIVE to connect to chat.
