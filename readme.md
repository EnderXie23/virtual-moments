# My Virtual Moments Repository
Now we have implemented the main functions of Virtual Moments.

The main entrance is at `webpage/VM.html`. To fully unlock the functions we have implemented, you shall run `webpage/webapi.py` on the remote server.

## To run on your computer:
1. Clone the github repository by running on both your **remote server** and your **local computer**:
```
git clone git@github.com:EnderXie23/virtual-moments.git
```
2. On your remote server, run `webpage/webapi.py`:
```
cd ./virtual-moments/webpage
python webapi.py
```
3. On your local machine, double click to run `webpage/VM.html`.


### LOGS

Congratulations! Now the HTML page can correctly call all the functions we have implemented.

Congratulations! Now we can use a webui to chat with the LLM with character! (Yet the contents now is limited to Furina)

### TASKS
- [x] Implement a LLM agent with memory so that it can read from file and generate answers in the same manner.
- [x] Implement a script that can generate an HTML page.
- [x] Implement an API service that can handle HTML requests.
- [ ] (Not going to do) Implement a script that may generate images according to context.

