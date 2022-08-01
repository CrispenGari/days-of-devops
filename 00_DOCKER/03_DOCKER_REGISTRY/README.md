### Docker Registry

In this readme file we are going to learn how to publish images that we have created on our host to docker Registry. There are two types of publishes that we can do to docker registries for our docker images either:

1. Public
2. Private

### Pushing images to Docker Hub

We can publish our images to docker hub simply by running the `push` docker command. Docker hub has the ability to store both private and public images. Now let's go and create an account on [`Docker hub`](https://hub.docker.com/). Now we can go to the `Repositories` Tab. After that we are going to create a new repository, enter a name and description, make ether your repository private or public.

### Pushing the Image to DockerHub

Now let's go and create an image called website and push it to the docker registry. Our website will be in the `/website` folder. Then we need to create a new image by running the following command:

```shell
docker build -t crispengari/website:latest .
```

After that we are going to create a version `1.0` tag for the first release by running the following command:

```shell
docker tag crispengari/website:latest crispengari/website:1.0
```

Now when we update the website we need to build the image and then tag it to a new version in our case it will be with `2.0` tag

```shell
docker build -t crispengari/website:latest .
```

Then we tag the latest to `2.0` tag as follows:

```shell
docker tag crispengari/website:latest crispengari/website:2.0
```

Now if i run the docker `images` command i will be able to see something like:

```shell
REPOSITORY                      TAG       IMAGE ID       CREATED          SIZE
crispengari/website             2.0       85384d7f0b16   48 seconds ago   23.5MB
crispengari/website             latest    85384d7f0b16   48 seconds ago   23.5MB
crispengari/website             1.0       54094a5e7b8e   8 minutes ago    23.5MB
```

Based on the repository that we have created at https://hub.docker.com/repository/docker/crispengari/website we can now push our images to docker hub using the following command

```shell
docker push crispengari/website:tagname
```

> Note that you need to get authenticated from your command shell or command line and enter the credentials before pushing images to DockerHub. To login to docker you need to run the `login` command and enter credentials as follows:

```shell
docker login
```

Now let's go and push all the images that we have created with tags, `latest`, `1.0` and `2.0` in the following terminal.

```shell
docker push crispengari/website:latest
docker push crispengari/website:1.0
docker push crispengari/website:2.0
```

### Pulling our own images.

Now we can be able to pull our own images from docker hub by running the docker `pull` command. Let's test out our images locally and see if they will work. First we need to delete the local images and just to make sure that we will get these images from `DockerHub`.

```shell
docker pull crispengari/website:latest
docker pull crispengari/website:1.0
```

Now we can spin up the containers by running the following command:

```shell
docker run --name latest -d -p:3000:80 crispengari/website
docker run --name web_1 -d -p:3001:80 crispengari/website:1.0
```

If we run the `ps` command we will see that we have our containers running, and the good thing is that we pulled these images from DockerHub:

```shell
CONTAINER ID   IMAGE                     COMMAND                  CREATED              STATUS              PORTS                  NAMES
85517904ff94   crispengari/website:1.0   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:3001->80/tcp   web_1
4911e514cd84   crispengari/website       "/docker-entrypoint.…"   2 minutes ago        Up 2 minutes        0.0.0.0:3000->80/tcp   latest
```

### Debugging containers

So we can use the inspect command to inspect the running container for example we can inspect our `latest` container by running the following command:

```shell
docker inspect 4911e514cd84
# or
docker inspect latest
```

This yield the following response in json format:

```json
[
  {
    "Id": "4911e514cd84f0aa7a4029d0299cf69d35f035ff68cbce52fc86e4f955791428",
    "Created": "2022-08-01T11:15:02.0905378Z",
    "Path": "/docker-entrypoint.sh",
    "Args": ["nginx", "-g", "daemon off;"],
    "State": {
      "Status": "running",
      "Running": true,
      "Paused": false,
      "Restarting": false,
      "OOMKilled": false,
      "Dead": false,
      "Pid": 3858,
      "ExitCode": 0,
      "Error": "",
      "StartedAt": "2022-08-01T11:15:04.7898522Z",
      "FinishedAt": "0001-01-01T00:00:00Z"
    },
    "Image": "sha256:85384d7f0b168049c1ba43b9b416c48909e23c42e53f83627076f61eee1f6f31",
    "ResolvConfPath": "/var/lib/docker/containers/4911e514cd84f0aa7a4029d0299cf69d35f035ff68cbce52fc86e4f955791428/resolv.conf",
    "HostnamePath": "/var/lib/docker/containers/4911e514cd84f0aa7a4029d0299cf69d35f035ff68cbce52fc86e4f955791428/hostname",
    "HostsPath": "/var/lib/docker/containers/4911e514cd84f0aa7a4029d0299cf69d35f035ff68cbce52fc86e4f955791428/hosts",
    "LogPath": "/var/lib/docker/containers/4911e514cd84f0aa7a4029d0299cf69d35f035ff68cbce52fc86e4f955791428/4911e514cd84f0aa7a4029d0299cf69d35f035ff68cbce52fc86e4f955791428-json.log",
    "Name": "/latest",
    "RestartCount": 0,
    "Driver": "overlay2",
    "Platform": "linux",
    "MountLabel": "",
    "ProcessLabel": "",
    "AppArmorProfile": "",
    "ExecIDs": null,
    "HostConfig": {
      "Binds": null,
      "ContainerIDFile": "",
      "LogConfig": {
        "Type": "json-file",
        "Config": {}
      },
      "NetworkMode": "default",
      "PortBindings": {
        "80/tcp": [
          {
            "HostIp": "",
            "HostPort": "3000"
          }
        ]
      },
      "RestartPolicy": {
        "Name": "no",
        "MaximumRetryCount": 0
      },
      "AutoRemove": false,
      "VolumeDriver": "",
      "VolumesFrom": null,
      "CapAdd": null,
      "CapDrop": null,
      "CgroupnsMode": "host",
      "Dns": [],
      "DnsOptions": [],
      "DnsSearch": [],
      "ExtraHosts": null,
      "GroupAdd": null,
      "IpcMode": "private",
      "Cgroup": "",
      "Links": null,
      "OomScoreAdj": 0,
      "PidMode": "",
      "Privileged": false,
      "PublishAllPorts": false,
      "ReadonlyRootfs": false,
      "SecurityOpt": null,
      "UTSMode": "",
      "UsernsMode": "",
      "ShmSize": 67108864,
      "Runtime": "runc",
      "ConsoleSize": [30, 120],
      "Isolation": "",
      "CpuShares": 0,
      "Memory": 0,
      "NanoCpus": 0,
      "CgroupParent": "",
      "BlkioWeight": 0,
      "BlkioWeightDevice": [],
      "BlkioDeviceReadBps": null,
      "BlkioDeviceWriteBps": null,
      "BlkioDeviceReadIOps": null,
      "BlkioDeviceWriteIOps": null,
      "CpuPeriod": 0,
      "CpuQuota": 0,
      "CpuRealtimePeriod": 0,
      "CpuRealtimeRuntime": 0,
      "CpusetCpus": "",
      "CpusetMems": "",
      "Devices": [],
      "DeviceCgroupRules": null,
      "DeviceRequests": null,
      "KernelMemory": 0,
      "KernelMemoryTCP": 0,
      "MemoryReservation": 0,
      "MemorySwap": 0,
      "MemorySwappiness": null,
      "OomKillDisable": false,
      "PidsLimit": null,
      "Ulimits": null,
      "CpuCount": 0,
      "CpuPercent": 0,
      "IOMaximumIOps": 0,
      "IOMaximumBandwidth": 0,
      "MaskedPaths": [
        "/proc/asound",
        "/proc/acpi",
        "/proc/kcore",
        "/proc/keys",
        "/proc/latency_stats",
        "/proc/timer_list",
        "/proc/timer_stats",
        "/proc/sched_debug",
        "/proc/scsi",
        "/sys/firmware"
      ],
      "ReadonlyPaths": [
        "/proc/bus",
        "/proc/fs",
        "/proc/irq",
        "/proc/sys",
        "/proc/sysrq-trigger"
      ]
    },
    "GraphDriver": {
      "Data": {
        "LowerDir": "/var/lib/docker/overlay2/5129327b292eb0c5c90754fd4774a65ec60301ccff63436991a53ca715b911f4-init/diff:/var/lib/docker/overlay2/jqjhzdtuf32jq9srnc0zn28ji/diff:/var/lib/docker/overlay2/pxtgygc5ri8xpygiz44bxst3h/diff:/var/lib/docker/overlay2/58d2294a705a7264550a61b23477fc05434007e3dc15a2fea9af21b69725a033/diff:/var/lib/docker/overlay2/38090baecfe2570f17e1585952abbf03fb278c3fadacf8fdc8c9988f73dd52ea/diff:/var/lib/docker/overlay2/597c55e5bdf5333ed00b629b075c6809c3fa674ed5a4f6d0607b91bc9c2ef1c8/diff:/var/lib/docker/overlay2/a2b9b5a14351a3a34e1b6c1e53413c0711bb59599e3eb99e54cc61437042d152/diff:/var/lib/docker/overlay2/e237949b451032aa2c93a475badb9e20e7a25f3bb504921f71801736e153cab5/diff:/var/lib/docker/overlay2/ff5d13c96ca010cb417499355545dcd6b660d95a4fb20ea6b009ef58cf25b65a/diff",
        "MergedDir": "/var/lib/docker/overlay2/5129327b292eb0c5c90754fd4774a65ec60301ccff63436991a53ca715b911f4/merged",
        "UpperDir": "/var/lib/docker/overlay2/5129327b292eb0c5c90754fd4774a65ec60301ccff63436991a53ca715b911f4/diff",
        "WorkDir": "/var/lib/docker/overlay2/5129327b292eb0c5c90754fd4774a65ec60301ccff63436991a53ca715b911f4/work"
      },
      "Name": "overlay2"
    },
    "Mounts": [],
    "Config": {
      "Hostname": "4911e514cd84",
      "Domainname": "",
      "User": "",
      "AttachStdin": false,
      "AttachStdout": false,
      "AttachStderr": false,
      "ExposedPorts": {
        "80/tcp": {}
      },
      "Tty": false,
      "OpenStdin": false,
      "StdinOnce": false,
      "Env": [
        "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "NGINX_VERSION=1.23.1",
        "NJS_VERSION=0.7.6",
        "PKG_RELEASE=1"
      ],
      "Cmd": ["nginx", "-g", "daemon off;"],
      "Image": "crispengari/website",
      "Volumes": null,
      "WorkingDir": "/usr/share/nginx/html",
      "Entrypoint": ["/docker-entrypoint.sh"],
      "OnBuild": null,
      "Labels": {
        "maintainer": "NGINX Docker Maintainers \u003cdocker-maint@nginx.com\u003e"
      },
      "StopSignal": "SIGQUIT"
    },
    "NetworkSettings": {
      "Bridge": "",
      "SandboxID": "31806230ab0f468daa5280e344fab8f7cc86303290ef112e215fc2e78ed1def1",
      "HairpinMode": false,
      "LinkLocalIPv6Address": "",
      "LinkLocalIPv6PrefixLen": 0,
      "Ports": {
        "80/tcp": [
          {
            "HostIp": "0.0.0.0",
            "HostPort": "3000"
          }
        ]
      },
      "SandboxKey": "/var/run/docker/netns/31806230ab0f",
      "SecondaryIPAddresses": null,
      "SecondaryIPv6Addresses": null,
      "EndpointID": "f3ec69f3523d9a9150b46d7d2cdfa2262fff43f8a7b0bbc71d36be0cd8d854bf",
      "Gateway": "<IP Address>",
      "GlobalIPv6Address": "",
      "GlobalIPv6PrefixLen": 0,
      "IPAddress": "172.17.0.2",
      "IPPrefixLen": 16,
      "IPv6Gateway": "",
      "MacAddress": "02:42:ac:11:00:02",
      "Networks": {
        "bridge": {
          "IPAMConfig": null,
          "Links": null,
          "Aliases": null,
          "NetworkID": "f31125781535ec75712c3766f0db14db702d45f26e44a22055b04a244e0f046e",
          "EndpointID": "f3ec69f3523d9a9150b46d7d2cdfa2262fff43f8a7b0bbc71d36be0cd8d854bf",
          "Gateway": "<IP Address>",
          "IPAddress": "172.17.0.2",
          "IPPrefixLen": 16,
          "IPv6Gateway": "",
          "GlobalIPv6Address": "",
          "GlobalIPv6PrefixLen": 0,
          "MacAddress": "02:42:ac:11:00:02",
          "DriverOpts": null
        }
      }
    }
  }
]
```

You can also check the logs of your container by running the `logs` docker command for example we can check the logs for our latest container as follows:

```shell
docker logs 4911e514cd84
# or
docker logs latest
```

### Bashing in containers

Sometime you will want to get inside a container and check what is actually going on inside that container. You can use the `exec` command for example:

```shell
docker exec -it <container_name or id> bash

# sometimes

docker exec -it <container_name or id> sh
```

For example we can try this on our `web_1` container:

```shell
docker exec -it 85517904ff94 sh

```

Output when we run the `ls` linux command .

```shell
/usr/share/nginx/html # ls
50x.html    Dockerfile  README.md   index.css   index.html  index.js
/usr/share/nginx/html #
```
