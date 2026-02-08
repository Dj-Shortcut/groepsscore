 tsc
#14 0.234 
Error: #14 1.435 src/server.ts(32,1): error TS1128: Declaration or statement expected.
Error: #14 1.435 src/server.ts(98,1): error TS1005: '}' expected.
#14 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 2
------
 > [build 5/5] RUN npm run build:
0.234 
0.234 > groepscore@0.1.0 build
0.234 > tsc
0.234 
Error: 1.435 src/server.ts(32,1): error TS1128: Declaration or statement expected.
Error: 1.435 src/server.ts(98,1): error TS1005: '}' expected.
------
==> Building image
Waiting for depot builder...

==> Building image with Depot
--> build:  (​)
#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 1.16kB 0.1s done
#1 DONE 0.1s

#2 resolve image config for docker-image://docker.io/docker/dockerfile:1
#2 DONE 0.2s

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 1.16kB 0.1s done
#1 DONE 0.1s

#3 docker-image://docker.io/docker/dockerfile:1@sha256:b6afd42430b15f2d2a4c5a02b919e98a525b785b1aaff16747d2f623364e39b6
#3 resolve docker.io/docker/dockerfile:1@sha256:b6afd42430b15f2d2a4c5a02b919e98a525b785b1aaff16747d2f623364e39b6 done
#3 CACHED

#4 [internal] load build definition from Dockerfile
#4 Deduplicating step ID [internal] load build definition from Dockerfile, another build is calculating it done
#4 DONE 0.0s

#5 [internal] load metadata for docker.io/library/node:22.21.1-slim
#5 DONE 0.2s

#6 [internal] load .dockerignore
#6 transferring context: 160B 0.1s done
#6 DONE 0.1s

#7 [internal] load build context
#7 DONE 0.0s

#8 [base 1/2] FROM docker.io/library/node:22.21.1-slim@sha256:25b3eb23a00590b7499f2a2ce939322727fcce1b15fdd69754fcd09536a3ae2c
#8 resolve docker.io/library/node:22.21.1-slim@sha256:25b3eb23a00590b7499f2a2ce939322727fcce1b15fdd69754fcd09536a3ae2c done
#8 DONE 0.0s

#7 [internal] load build context
#7 transferring context: 11.40kB 0.1s done
#7 DONE 0.1s

#9 [build 1/5] RUN apt-get update -qq &&     apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3
#9 CACHED

#10 [build 2/5] COPY package-lock.json package.json ./
#10 CACHED

#11 [build 3/5] RUN npm ci
#11 CACHED

#12 [base 2/2] WORKDIR /app
#12 CACHED

#13 [build 4/5] COPY . .
#13 CACHED

#14 [build 5/5] RUN npm run build
#14 0.208 
#14 0.208 > groepscore@0.1.0 build
#14 0.208 > tsc
#14 0.208 
Error: #14 1.359 src/server.ts(32,1): error TS1128: Declaration or statement expected.
Error: #14 1.359 src/server.ts(98,1): error TS1005: '}' expected.
#14 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 2
------
 > [build 5/5] RUN npm run build:
0.208 
0.208 > groepscore@0.1.0 build
0.208 > tsc
0.208 
Error: 1.359 src/server.ts(32,1): error TS1128: Declaration or statement expected.
Error: 1.359 src/server.ts(98,1): error TS1005: '}' expected.
------
Error: failed to fetch an image or build from source: error building: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 2
Error: Process completed with exit code 1.
