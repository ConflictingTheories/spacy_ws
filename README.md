# spacyio_ws
Example of Combining Websockets with Spacy.io NLP Library.

Example of Websocket streaming data as typed and returning Entities identified by Spacy Library.

# Server / Client
Server acts like an NLP API - Opens a websocket listener and then waits for a connection. When connected, it reads the stream and then parses the stream through the NLP model and returns identified entities.

Client opens a connection to the server - then it allows the user to type and whatever is typed is streamed to the NLP model.

        # setup
        sudo setup.sh

        # in first tab
        cd server
        ./ws_api_server.py

        # in other tab
        cd server
        ./ws_api_client.py

# Training
Shows an example of training a new dataset - very basic example. Data learned is trained and stored in the model folder.

        # setup
        sudo setup.sh

        # run training example
        cd training
        ./weapon_spacy_train.py


# Mentions / usage
Created by Kyle Derby MacInnis for the purpose of learning. Please use to learn, but if using code, please reference me as the author.