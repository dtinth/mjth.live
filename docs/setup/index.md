# Server setup

This page describes how our Jamulus servers are set up. They are running on Debian VPS in Thailand.

## Architecture

![](https://im.dt.in.th/ipfs/bafybeib3pdvmsbyduw6biqvfcopl2ervtvz4ev3ld24w4cjl5tc4aw7kja/image.webp)

| Component                      | Description                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| [Jamulus](https://jamulus.io/) | The main server software that allows musicians to play together in real-time.                       |
| [gojam][]                      | Headless, programmable Jamulus client, used for streaming the audio to web listeners and recording. |
| [lounge][]                     | Web-based interface to let people listen in to a Jamulus server.                                    |
| [clipper][]                    | Allows musicians to [clip](/clipper/) the last 10 minutes of the stream for replay via chat.        |
| [jamviz][]                     | Web-based interface for replaying the clipped stream.                                               |
| [json-rpc-api-gateway][]       | Exposes functionalities of Jamulus’s JSON-RPC over HTTP.                                            |
| [recman][]                     | Allows musicians to control recording via chat and upload the recordings to a server.               |
| [upload-endpoint][]            | Provides simplified access for uploading recordings to an object storage.                           |
| [Cloudflare R2][r2]            | Object storage for storing recordings.                                                              |
| [n8n][]                        | Workflow automation tool for managing the welcome messages of each server.                          |

[gojam]: https://github.com/dtinth/gojam
[lounge]: https://github.com/dtinth/jamulus-lounge
[clipper]: https://github.com/dtinth/jamulus-lounge/blob/main/server/clipper.mjs
[json-rpc-api-gateway]: https://github.com/dtinth/jamulus-json-rpc-api-gateway
[recman]: https://github.com/dtinth/mjth-recman
[multitrack]: https://jamulus.io/wiki/Running-a-Server#recording
[upload-endpoint]: https://github.com/dtinth/upload-endpoint
[jamviz]: https://github.com/dtinth/jamviz
[r2]: https://www.cloudflare.com/developer-platform/products/r2/
[n8n]: https://n8n.io/

## Onboarding a new server

1. Install Docker:

   ```sh
   # In VPS
   curl -fsSL https://get.docker.com | sh
   ```

2. Define the server configuration in `deployConfigs` in `setup/deploy.ts`.

3. Set up Docker context:

   ```sh
   docker context create mjth-<codename> --docker "host=ssh://<user>@<host>"
   ```

4. Onboard some secrets:

   ```sh
   ./setup/onboard-secrets.sh <codename>
   ```

5. Deploy the server:

   ```sh
   node setup/deploy.ts <codename>
   ```
