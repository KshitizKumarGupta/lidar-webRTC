# Documentation for `lidar-p2p`

_Written By: Harish Rohan Kambhampaty (UntitledError-09, harishrohank@gmail.com)_

This is part of the **LiDAR Data Streaming** Project developed at TiHAN, IIT-H

This is an **alternative** to using Firebase; when **both** of the devices are **not** behind Symmetric NAT (AKA Full-Cone NAT). The type of NAT can be checked [here](https://clients.dh2i.com/NatTest/). Permissive NAT is a requirement for Peer-to-Peer (WebRTC) communication.

To learn more about NAT, go [here](https://dh2i.com/kbs/kbs-2961448-understanding-different-nat-types-and-hole-punching/).

_NOTE: A TURN Server is often cheaper than the Firebase method, however, it only allows single subscriber of the data stream. In contrast, the Firebase method allows multiple subscribers._

# Environment Setup

[ROS](https://www.ros.org/) (preferably [melodic](http://wiki.ros.org/melodic/Installation/Ubuntu) version for Ubuntu 18.04) is required to be setup on both the sender (encoder) and the receiver (decoder).

## ROS-Bridge Server Setup

ROS-Bridge server needs to be installed for [roslibjs](http://wiki.ros.org/roslibjs) which was part of the project that this repository was intended for.

Installation: (Change `melodic` to the required version)

```bash
sudo apt-get install ros-melodic-rosbridge-server
```

Starting Server:

```bash
roslaunch rosbridge_server rosbridge_websocket.launch
```

Node Package Manager (NPM) and [Node.js](https://nodejs.org/en/) are required to be installed (`npm@6.14+`, `node@14.17+`).

# Obtaining Source Code and Building

The source code is available [here](https://github.com/bhaskar-anand-iith/lidar-p2p).

Run the following commands:

```bash
cd ~ #directory where the project is to be located
git clone https://github.com/bhaskar-anand-iith/lidar-p2p
cd lidar-fb/ #root of project
npm i #installing dependencies
```

## Troubleshooting Build Errors

-   Version Error: ensure `npm@6.14+`, and `node@14.17+`

```bash
npm -v
node -v
```

# Execution

For testing locally:

```bash
npm run dev #runs the "dev" srcipt defined in package.json
```

## Webpage Operation

The sender and the receiver each have a UUID (randomly generated uniquely identifying ID). For the peer-to-peer connection to be established, the sender must connect to the receiver using the receiver's UUID. Once the connection is established, the connection will be open until the webpage is reloaded or the sender connects to another receiver.

**Sender/Sensor side:** Once the webpage has loaded, the webpage automatically subscribes to `/n2b_data` rostopic, and immediately tries publishing to the peer. Data is only sent after connection is established with peer.

**Receiver/Visualizer side:** Once the webpage has loaded and the sender peer has established connection, the data starts being published to `/b2n_data` rostopic.

## ROSTopic Specifications

Subscribes to `/n2b_data` topic (from native c++ code)

Publishes to `/b2n_data` topic (from browser)

# Deployment

The app has been deployed on [Heroku](https://www.heroku.com/). It is connected with GitHub (through a webhook) and automatically deploys any changes that are made to the `main` branch (by default) in the connected GitHub repository.

**Requires a Heroku account**

## Heroku Setup

1. Go to Heroku [Dashboard](https://dashboard.heroku.com/apps/)
1. Click on `New` -> [Create new app](https://dashboard.heroku.com/new-app)
1. Enter App name, choose a region, and click `Create app`
1. In the `Deploy` tab, set the deployment method to `GitHub` ![heroku deploy screen](/docs/heroku-deploy-1.jpg)
1. Search for the repository name (`lidar-fb`) (you **must** be owner of repository on GitHub. Explore _GitHub Teams_ for more features)
1. `Enable Automatic Deploys` and `Deploy Branch` (main)

The webapp will take some time to be built and deployed. The webapp can be accessed at `App-name`.herokuapp.com

For additional build information, access the `Activity` tab and click on the build of choice.

# Troubleshooting Common Errors

-   Not connecting to peer/No messages being sent or received: [check NAT type](https://clients.dh2i.com/NatTest/).
-   Receiving data but no visualization in RViz: check if roscore, ros-bridge server, and [decoder](https://github.com/bhaskar-anand-iith/LiDAR_datastream_transceiver) are running.
-   No data is being sent: check if roscore, ros-bridge server, and [encoder](https://github.com/bhaskar-anand-iith/LiDAR_datastream_transceiver) are running, check bandwidth.
-   Latency is continuously increasing over time: bandwidth is insufficient, find a better network.
