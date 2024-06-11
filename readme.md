# My Virtual Moments Repository
Now we have implemented the main functions of Virtual Moments.

The main entrance is at `webpage/VM.html`. To fully unlock the functions we have implemented, you shall run `webpage/webapi.py` on the remote server.

## To run on your computer:

1. Clone the github repository by running on both your **lab server** and your **local computer**:
```
git clone git@github.com:EnderXie23/virtual-moments.git
```
2. On your lab server, run `webpage/webapi.py`:
```
cd ./virtual-moments/webpage
python webapi.py
```
3. On your local machine, double click to run `webpage/VM.html`.

## To add your own virtual friend:

Let's say your virtual friend is named "Happy" (**Note**: We currently only support **one word names only**), follow the steps below to start chatting with him/her!

1. Add training data to the repository.

The data shall be in the following format:

```
# One line to represent a question
# One line to represent an answer
What would you say when it is raining?
Hmm... The rain drops are like jwelry falling from the sky!
...
...
```

Note that the comments shall not be present in your training data. No other information (Cues, hints, etc.) shall be present in your training data. About **25 Q&A examples** is enough for training, but the data works best if they **cover multiple realms of everyday life** and can **reflect the tone in which your friend speaks**.

Now name your file as `happy.txt` and put it under the `webpage/text/` folder. **Your file name shall all be in lower case letters**.



2. Add your friend's icon to the repository.

Add a image file under the directory `webpage/photos/`. There is no strict naming requirements for this file. Let's say this image file is named `happy.png`.



3. Do some changes to `chatpage/js/chatscript.js`.

On the first few lines of this script, you'll see:

```js
const additionalCharacters = [
    // { character: "YOUR_CHARACTER", file: "../webpage/photos/YOUR_PNG.png", location: "YOUR_LOCATION" },
]
```

Now modify this line as:

```js
const additionalCharacters = [
    { character: "Happy", file: "../webpage/photos/happy.png", location: "Beijing" },
]
```

The location variable is optional, which is used to beautify the interface.



4. All the changes shall take place **on both your lab server and your local machine**!



5. Re-run `chatpage/ChatUI.html` to chat with your new friend!

## LOGS

Congratulations! Now the HTML page can correctly call all the functions we have implemented.

Update Virtual Moments HTML.

Update multiple character chatting interface.

Congratulations! Now we can use a webui to chat with the LLM with character! (Yet the contents now is limited to Furina)

## TASKS

- [x] Implement a LLM agent with memory so that it can read from file and generate answers in the same manner.
- [x] Implement a script that can generate an HTML page.
- [x] Implement an API service that can handle HTML requests.
- [ ] (Not going to do) Implement a script that may generate images according to context.

