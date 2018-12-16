# msHack

## Smart Traffic Light Management 
We track traffic density in all directions of the traffic lights through object detection for various vehicles, and using a formula with different weights for different types of vehicles, we calculate the density of traffic on each side. Using this information, we log it on our database to make it available to public. We also use this density to manage the duration of traffic lights before they change colours.


## BeaconApp

Our Third project is beacon app, which is an android app which will receive messages from nearby beacons using small frequency radio waves via bluetooth.

MOTIVATION for app :- When a person is driving and there is an anomaly on road like fire or traffic jam or any other issue which can delay in traffic then on traffic light of that road a message will be popped on your smartphone about the issue and guide you to take different route. In this way driver can save time and fuel both. Beacons get the messages from our main server and the information about anomaly is given by our cameras installed on every traffic light. The cameras will detect anomaly using computer vision and push the message to main server if found with location details of road.

Range of beacons vary from 70m to 450m so on an average 260m.Our Third project is beacon app, which is an android app which will receive messages from nearby beacons using small frequency radio waves via bluetooth. 

## Anti Theft

Our cameras at several key spots throughout the city continually track vehicles and store their images and on successful detection of number plates, the vehicle's presence is logged with the coordinates. This data can then be used to track the vehicles. Users can register stolen cars using an android app as well, we help continually track it.

## More Information

https://devpost.com/software/trafficai

## Technologies

- Azure Cloud Services
    -   Azure VMs 
    -   CosmosDB 
- MEAN Stack
    