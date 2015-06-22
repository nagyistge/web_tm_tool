# web_tm_tool
Web based threat modeling tool

This is my humble attempt to create a web based threat modeling tool using Fabric JS and JQuery

Advantages of having a web based threat modeling tool:

1. No need of any supporting programs such as DotNet or any such thing
2. Runs from any machine with a browser
3. Links to threat models can be shared to others for collaboration

Advantages of current plan of threat model:

1. Microsoft threat modeling tool has one disadvantage. Upon creating a threat model, threats corresponding to all elements are displayed. However, in this threat model, threats are added individually to each element, thus reducing the number of false positives
2. Canvas is stored as XML, thereby it can be used in some other application
3. Threats need not be specific to Microsoft/Linux. It is left to the user to write the threats

The following features are present as of now:

1. Add file stores
2. Add processes
3. Add connectors
4. Add boundaries
5. Move the objects
6. Resize the objects
7. Rename objects
8. Join connectors to objects
9. Unjoin connectors from objects
10. Change the name of the object
11. Read threats corresponding to an object
12. Add more threats to objects
13. Delete threats
14. Save the objects - TBD
15. Delete objects
