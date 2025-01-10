# twingate/setup

To install & setup the latest version of Twingate:

 ```yaml
 tasks:
   - key: twingate
     call: twingate/setup 1.0.0
     with:
       twingate-service-key: ${{ secrets.twingate-service-key }}
 ```
