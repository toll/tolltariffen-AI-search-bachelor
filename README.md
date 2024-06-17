Bachelor Project - AI Classification of Goods for Norwegian Customs
============
AI-Klassifisering er et bachelorprosjekt laget av AI-studenter
Yousra, Yosef, Sharjeel og frontend-studenter Jennifer og Miles
fra Høyskolen Kristiania i samarbeid med IT-divisjonen i
Tolletaten. Prosjektets formål er å hjelpe norske importører og
eksportører ved å identifisere riktige varenummer for deklarasjon
av varer.


Useful links
============
- [Tolltariff Struktur Dataset](https://data.toll.no/dataset/tolltariffstruktur?language=no)
- [React Create new app](https://legacy.reactjs.org/docs/create-a-new-react-app.html)
- [UI Components](https://mui.com/core/)
- [Tolltariff website](https://tolltariffen.toll.no/tolltariff)
- [Varenummer website](https://varenummer.toll.no/tariffering/bku)
- [Python OpenAI PyPI](https://pypi.org/project/openai/)
- [Prompt example on Imaginary Cloud](https://www.imaginarycloud.com/blog/chatgpt-prompt-engineering/)
- [Prompt example on Machine Learning Mastery](https://machinelearningmastery.com/prompt-engineering-for-effective-interaction-with-chatgpt/)
- [Example for Semantic Search](https://www.elastic.co/what-is/semantic-search)
- [Library for vectorising](https://python.langchain.com/docs/get_started/introduction)
- [National Library Model AI Lab](https://huggingface.co/NbAiLab/nb-sbert-base)

Project Description
==================
The project is designed to accept user prompts about goods for import and export in a user-friendly web UI. 
The prompt is checked for regulations based on Norwegian customs. It informs the user about the possible 
classification of the customs and returns the goods' category and its customs ID. 
Additionally, it returns the next two most-likely classifications in case of uncertainties.

Milestones
==========
1. Complete the foundation
   1. Accept user input from prompts
   2. Send the user input to openAI's API
   3. Read and analyse the API response
2. Advanced usage of API 
   1. Use of more customisable API parameters for sending
   2. Advanced analysis of more complex response
3. AI model
   1. Retrieve and analyse Norwegian customs data
   2. Customise own model based on openAI's functionality
   3. Make use of the customised model
4. Frontend
   1. UI to accept user prompts
   2. UI to display the responses
   3. Own API to communicate between Frontend and Backend


Price Estimations
=================
- 100 Token per line, 11.123 lines in total
- 1K Token with GPT-4: 0.03 USD, 1K Token = 10 lines 
- 11.123 lines = 1112 * 0.03 USD = 33.36 USD total cost

Usage
=====
Download tolltariffen dataset from [here](https://data.toll.no/dataset/tolltariffstruktur?language=no) and place it in the `backend/dataset` folder.
Create a config.ini file in the `backend` folder, copy the template and fill the open-ai key.
Run `docker-compose up --build` to create and start the docker containers for the frontend and backend.