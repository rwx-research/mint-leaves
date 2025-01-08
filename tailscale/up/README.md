# tailscale/up

To connect mint to a tailscale network:

```yaml
tasks:
  - key: install-tailscale
    call: tailscale/install 1.0.0

  - key: tailscale-up
    use: install-tailscale
    call: tailscale/up 1.0.0
    with:
      oauth-secret: ${{ secrets.tailscale-oauth-secret }}
      tags: tag:mint
```

`tags` is a comma-separated list of one or more ACL Tags for the node. At least one tag is required:
an OAuth client is not associated with any of the Users on the tailnet, it has to tag its nodes.

Nodes created by this leaf are marked as ephemeral and are automatically removed by the coordination
server a short time after they finish their run. The nodes are also marked preapproved on tailnets
which use device approval.

To use a fixed hostname:

```yaml
tasks:
  - key: install-tailscale
    call: tailscale/install 1.0.0

  - key: tailscale-up
    use: install-tailscale
    call: tailscale/up 1.0.0
    with:
      oauth-secret: ${{ secrets.tailscale-oauth-secret }}
      tags: tag:mint
      hostname: my-host
```

Additional arguments can be passed to `tailscale up` and `tailscaled` using the `up-args` and
`tailscaled-args` respectively:

```yaml
tasks:
  - key: install-tailscale
    call: tailscale/install 1.0.0

  - key: tailscale-up
    use: install-tailscale
    call: tailscale/up 1.0.0
    with:
      oauth-secret: ${{ secrets.tailscale-oauth-secret }}
      tags: tag:mint
      up-args: "--login-server=https://example.org"
      tailscaled-args: "--socks5-server=:1234"
```

Note that `tailscaled` must be started in a background process for each task that wants to connect
to a tailscale network. For example:

```yaml
tasks:
  - key: install-tailscale
    call: tailscale/install 1.0.0

  - key: tailscale-up
    use: install-tailscale
    call: tailscale/up 1.0.0
    with:
      oauth-secret: ${{ secrets.tailscale-oauth-secret }}
      tags: tag:mint

  - key: test                                                                                       
    use: [tailscale-up]                                                                                  
    background-processes:                                                                           
      - key: tailscaled                                                                             
        run: sudo tailscaled                                                                        
        ready-check: tailscale status                                                               
    run: |                                                                                          
      // do work here
```
