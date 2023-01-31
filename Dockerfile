
FROM python:3.8-slim-buster

RUN mkdir -p /home/server

WORKDIR /home/server

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt


COPY server .
RUN pytest -q test.py

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=8000"]