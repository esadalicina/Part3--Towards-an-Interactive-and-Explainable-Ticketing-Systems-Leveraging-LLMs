# Master Thesis Part 3: Towards an Interactive and Explainable Ticketing System Leveraging Large Language Models (LLMs)

This repository presents the third part of my thesis, introducing a novel approach to ticketing systems by integrating a Discord-based community with task-specific bots (such as ticket handling, a chatbot, and a voting bot). The proposed system leverages the open-source capabilities of the Discord platform to manage and process support requests directly within Discord channels, utilizing its real-time communication features and large community support. An initial evaluation of the system indicates that 88% of users are satisfied with the use of Discord, highlighting its potential to provide scalable solutions for various community-driven support scenarios. 

Master Thesis Part 1 - This repository involves preprocessing the dataset for the ticketing system to improve ticket classification through the evaluation and comparison of machine learning, deep learning, and large language models:

https://github.com/esadalicina/Part1--Towards-an-Interactive-and-Explainable-Ticketing-Systems-Leveraging-LLMs.git

Master Thesis Part 2 - The focus is on both the backend and frontend of the Ticketing System:

https://github.com/esadalicina/Part2--Towards-an-Interactive-and-Explainable-Ticketing-Systems-Leveraging-LLMs.git


## HAI24 Conference Poster - Optimizing Helpdesk Ticketing Systems with Discord Community Integration

HAI24 Conference Paper:

http://camps.aptaracorp.com/ACM_PMS/PMS/ACM/HAI24/55/ba221659-66d1-11ef-ada9-16bb50361d1f/OUT/hai24-55.html


![HAI24 Conference Poster](Poster.jpg)



## Repository Contents

- Chatbot/: JavaScript file for the chat bot
- VotingBot/: JavaScript file for the voting bot
- README.md: Instructions for running the bots


## Installation

### Prerequisites

- **Python 3.8+** installed on your machine

### Setup Instructions

1. **Clone the repository** to your local machine:

    ```bash
    git clone https://github.com/esadalicina/Part3--Towards-an-Interactive-and-Explainable-Ticketing-Systems-Leveraging-LLMs.git
    cd Part3--Towards-an-Interactive-and-Explainable-Ticketing-Systems-Leveraging-LLMs
    ```

2. **Create a virtual environment** (optional but recommended):

    ```bash
    python -m venv venv
    ```

3. **Activate the virtual environment**:

    - On **Windows**:

      ```bash
      venv\Scripts\activate
      ```

    - On **macOS/Linux**:

      ```bash
      source venv/bin/activate
      ```

4. **Install the required dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

5. **Set up environment variables**:
   
   - Create a `.env` file in the Chatbot directory of your project with the necessary environment variables:

    ```plaintext
    APP_ID: This is typically an identifier for your application. For a Discord bot, this is often associated with your bot’s registration in the Discord Developer Portal. After creating your application (bot), the APP_ID can be found under the “General Information” section.

    - To get your APP_ID:
        - Go to Discord Developer Portal.
        - Select your bot application.
        - In the "General Information" tab, you’ll find the Application ID.

    DISCORD_TOKEN: This is your bot’s unique token, which is used to authenticate it with Discord's API.

    - To get your DISCORD_TOKEN:
        - Go to Discord Developer Portal.
        - Choose your bot application.
        - Navigate to the “Bot” tab.
        - Under "TOKEN," click "Copy" to get your bot's token.

    PUBLIC_KEY: This is an encryption key typically used for verifying requests (such as from Discord). It's part of the bot's configuration.

    - To get your PUBLIC_KEY:
      - Go to Discord Developer Portal.
      - Select your bot application.
      - Under the “Bot” section, you may find your bot’s public key listed or you might need to generate it depending on your use case (OAuth2, bot authentication, etc.).

    OPENAI_API_KEY: This is your key for interacting with OpenAI's API (used for GPT models).

    - To get your OPENAI_API_KEY:
        - Go to OpenAI.
        - Log in or sign up if you don’t have an account.
        - Go to the API keys section in your OpenAI dashboard.
        - Generate a new API key or copy an existing one.

    CHATBOT_API_KEY: This is a key for the chatbot's service (could be OpenAI, or another chatbot platform you are using).

    - To get your CHATBOT_API_KEY:
        - This depends on the service you are using for your chatbot (for example, Dialogflow, Wit.ai, etc.).
        - You typically create an account on the platform (such as Dialogflow or others) and generate an API key/token through their dashboard.

    ```

  - Create a `.env` file in the VotingBot directory of your project with the necessary environment variables:

    ```plaintext
    APP_ID: Similar to the Chatbot, this is your application's identifier for the VotingBot. It can be found in the Discord Developer Portal under "General Information."

    - To get your APP_ID: Follow the same steps as for the Chatbot to get the Application ID for your VotingBot.

    DISCORD_TOKEN: This is your VotingBot's token for Discord authentication. You can find this under the "Bot" section in the Discord Developer Portal, just like the Chatbot token.
    
    - To get your DISCORD_TOKEN: Follow the same steps as for the Chatbot to get the bot token for your VotingBot.

    PUBLIC_KEY: Similar to the Chatbot, this is a public key that might be used in your VotingBot for verification or encryption purposes.

    - To get your PUBLIC_KEY: Follow the same steps as for the Chatbot to get the public key for your VotingBot, if required.
    ```

6. Download and Install ngrok (if not already avaible)
   
- Sign in, download ngrok and install it: https://ngrok.com
- Once downloaded, unzip the file, and move it to a folder that's in your system's PATH (so you can run it from anywhere in the terminal).

    
## Running the Project

1. **Navigate to the project directory**:

- Chatbot Terminal 2:
  
    ```bash
    cd Part3--Towards-an-Interactive-and-Explainable-Ticketing-Systems-Leveraging-LLMs/Chatbot
    ```
- VotingBot Terminal 3:
  
    ```bash
    cd Part3--Towards-an-Interactive-and-Explainable-Ticketing-Systems-Leveraging-LLMs/VotingBot
    ```

2. **Run the Bots**:

- Terminal 1:
  
    ```bash
       ngrok http http://localhost:8080
    ```

- Chatbot Terminal 2:
  
    ```bash
       npm run start 
    ```
  
- VotingBot Terminal 3:
  
    ```bash
       npm run start 
    ```


  

